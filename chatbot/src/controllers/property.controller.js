import { asyncHandler } from '../utils/asyncHandler.js';
// import { ApiResponse } from '../utils/ApiResponse.js';
// import { ApiError } from '../utils/ApiError.js';
import { Property } from '../models/property.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js'; // Cloudinary utility
import mongoose from 'mongoose';

// Property types - locations are now fully dynamic (any location allowed)
const PROPERTY_TYPES = ['flat', 'house'];

/**
 * @desc Add a new property
 * @route POST /api/properties
 * @access Private (Seller, Admin)
 * @param {Object} req.files - Multer se uploaded files (images)
 */
export const addProperty = asyncHandler(async (req, res) => {
    const { title, description, price, location, area, rooms, type, squareFeet } = req.body;
    const ownerId = req.user._id; // Logged-in user (owner of the property)

    // Debug logging
    console.log('Received property data:', { title, description, price, location, area, rooms, type, squareFeet });
    console.log('Files received:', req.files?.length || 0);

    // Validation
    if (!title?.trim() || !description?.trim() || !price || !location?.trim() || !rooms || !type?.trim()) {
        return res.status(400).json({
            success: false,
            error: 'Title, description, price, location, rooms, and type are required.'
        });
    }
    if (isNaN(price) || price <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Price must be a positive number.'
        });
    }
    if (isNaN(rooms) || rooms < 1) {
        return res.status(400).json({
            success: false,
            error: 'Rooms must be an integer of 1 or more.'
        });
    }
    // Removed strict location validation to allow custom locations
    // Location can now be any non-empty string
    if (!PROPERTY_TYPES.includes(type.toLowerCase())) {
        return res.status(400).json({
            success: false,
            error: `Invalid property type. Allowed types are: ${PROPERTY_TYPES.join(', ')}`
        });
    }

    // Handle image uploads
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'At least one image is required for the property.'
        });
    }

    const uploadedImages = [];
    for (const file of req.files) {
        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        if (cloudinaryResponse && cloudinaryResponse.url && cloudinaryResponse.public_id) {
            uploadedImages.push({
                url: cloudinaryResponse.url,
                public_id: cloudinaryResponse.public_id
            });
        } else {
            // Agar koi image upload fail ho jaye, to error throw karein aur uploaded images ko bhi delete karein (optional cleanup)
            // Cleanup previously uploaded images if any error occurs
            for (const img of uploadedImages) {
                await deleteFromCloudinary(img.public_id);
            }
            return res.status(500).json({
                success: false,
                error: `Failed to upload image: ${file.originalname}.`
            });
        }
    }

    // Optional: Area uniqueness check within a location
    // Seller apni marzi ka area de sakta hai, lekin woh us predefined location mein unique hona chahiye.
    const lowerCaseArea = area ? area.toLowerCase() : undefined;
    if (lowerCaseArea) {
        const existingPropertyInArea = await Property.findOne({
            location: location.toLowerCase(),
            area: lowerCaseArea,
            // owner: ownerId // Agar seller-specific uniqueness chahiye to ye uncomment karein
        });

        if (existingPropertyInArea) {
            return res.status(409).json({
                success: false,
                error: `An area '${area}' already exists in location '${location}'. Please choose a different area or update the existing one.`
            });
        }
    }

    const property = await Property.create({
        title,
        description,
        price,
        location: location.toLowerCase(),
        area: lowerCaseArea,
        squareFeet: squareFeet ? Number(squareFeet) : undefined,
        rooms,
        type: type.toLowerCase(),
        images: uploadedImages,
        owner: ownerId,
    });

    if (!property) {
        // Agar property create na ho paye, to uploaded images ko delete karein
        for (const img of uploadedImages) {
            await deleteFromCloudinary(img.public_id);
        }
        return res.status(500).json({
            success: false,
            error: "Property add karne mein nakamyabi hui. Dobara koshish karein."
        });
    }

    return res.status(201).json({
        success: true,
        message: "Property safalta-poorvak add ho gayi.",
        data: property
    });
});

/**     
 * @desc Get all properties with filters
 * @route GET /api/properties
 * @access Public (Anyone can view)
 */
export const getAllProperties = asyncHandler(async (req, res) => {
    const { priceRange, location, rooms, type, search, area } = req.query; // Filters from query parameters

    // Debug logging
    console.log('Query params:', { priceRange, location, rooms, type, search, area });

    const query = { isAvailable: true }; // Sirf avalable properties dikhayen
    const andConditions = [];

    // Price Range Filter
    if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            query.price = { $gte: minPrice, $lte: maxPrice };
        } else if (!isNaN(minPrice) && priceRange.endsWith('+')) { // e.g., "50000000+"
            query.price = { $gte: minPrice };
        }
    }

    // Location Filter - any location allowed
    if (location) {
        query.location = location.toLowerCase();
    }

    // Area (Square Feet) Filter - check both squareFeet and area fields
    if (area) {
        const areaNum = Number(area);
        console.log('Area filter value:', areaNum, 'Type:', typeof areaNum);
        if (!isNaN(areaNum) && areaNum > 0) {
            // Match either squareFeet field OR area field containing the number
            const areaOrConditions = [
                { squareFeet: areaNum }
            ];
            
            // Also try to match area field (old format like "120 sq ft")
            areaOrConditions.push({ area: `${areaNum} sq ft` });
            areaOrConditions.push({ area: { $regex: `^${areaNum}\\s`, $options: 'i' } });
            
            andConditions.push({
                $or: areaOrConditions
            });
            console.log('Area OR conditions:', JSON.stringify(areaOrConditions, null, 2));
        }
    }

    // Rooms Filter
    if (rooms) {
        const roomsNum = parseInt(rooms);
        if (!isNaN(roomsNum) && roomsNum >= 1) {
            if (rooms.endsWith('+')) { // e.g., "6+" rooms
                query.rooms = { $gte: roomsNum };
            } else {
                query.rooms = roomsNum;
            }
        } else {
            return res.status(400).json({
                success: false,
                error: "Invalid rooms filter. Must be an integer of 1 or more."
            });
        }
    }

    // Type Filter (flat or house)
    if (type) {
        const lowerCaseType = type.toLowerCase();
        if (PROPERTY_TYPES.includes(lowerCaseType)) {
            query.type = lowerCaseType;
        } else {
            return res.status(400).json({
                success: false,
                error: `Invalid property type filter. Allowed types are: ${PROPERTY_TYPES.join(', ')}`
            });
        }
    }

    // Search by title or description (optional)
    if (search) {
        const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
        andConditions.push({
            $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } }
            ]
        });
    }

    // Combine all conditions
    if (andConditions.length > 0) {
        query.$and = andConditions;
    }

    console.log('Final query:', JSON.stringify(query, null, 2));

    const properties = await Property.find(query)
        .populate('owner', 'email fullName') // Owner ki details load karein
        .sort({ createdAt: -1 }); // Nayi properties pehle show honge

    if (!properties || properties.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No properties found matching the filters.",
            data: []
        });
    }

    return res.status(200).json({
        success: true,
        message: "Properties found successfully.",
        data: properties
    });
});

/**
 * @desc Get a single property by ID
 * @route GET /api/properties/:id
 * @access Public
 */
export const getPropertyById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            error: "Invalid Property ID."
        });
    }

    const property = await Property.findById(id).populate('owner', 'email fullName');

    if (!property || !property.isAvailable) { // Sirf available property dikhayen
        return res.status(404).json({
            success: false,
            error: "Property not found or not available."
        });
    }

    return res.status(200).json({
        success: true,
        message: "Property found successfully.",
        data: property
    });
});

export const getUsersProperties = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Logged-in user ki ID
    const userRole = req.user.role; // Logged-in user ka role

    if(userRole !== 'seller'){
        return res.status(403).json({
            success: false,
            error: "You are not authorized to access this resource."
        });
    }

    const query = { owner: userId }; // Sirf user ki properties dikhayen

    // Get all properties of the user
    const properties = await Property.find(query)
        .populate('owner', 'email fullName') // Owner ki details load karein
        .sort({ createdAt: -1 }); // Nayi properties pehle show honge

    if (!properties || properties.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No properties found matching the filters.",
            data: []
        });
    }

    return res.status(200).json({
        success: true,
        message: "Properties found successfully.",
        data: properties
    });
});

/**
 * @desc Update an existing property
 * @route PUT /api/properties/:id
 * @access Private (Seller, Admin)
 * @param {Object} req.files - Multer se uploaded new images (optional)
 * @param {Array} req.body.existingImages - Existing images jinhe retain karna hai (JSON string of objects with url and public_id)
 */
export const updateProperty = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id; // Logged-in user ki ID
    const userRole = req.user.role; // Logged-in user ka role
    const { title, description, price, location, area, rooms, type, isAvailable, existingImages, squareFeet } = req.body; 
    // existingImages is a JSON string of image objects that should be kept

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            error: "Invalid Property ID."
        });
    }

    const property = await Property.findById(id);

    if (!property) {
        return res.status(404).json({
            success: false,
            error: "Property nahi mili."
        });
    }

    // Authorization: Admin koi bhi update kar sakta hai, Seller sirf apni property
    if (userRole !== 'admin' && property.owner.toString() !== userId.toString()) {
        return res.status(403).json({
            success: false,
            error: "Forbidden: Aapko is property ko update karne ki ijazat nahi hai."
        });
    }

    // Update basic fields
    if (title !== undefined) property.title = title.trim();
    if (description !== undefined) property.description = description.trim();
    if (price !== undefined) {
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({
                success: false,
                error: "Price must be a positive number."
            });
        }
        property.price = price;
    }
    if (rooms !== undefined) {
        if (isNaN(rooms) || rooms < 1) {
            return res.status(400).json({
                success: false,
                error: "Rooms must be an integer of 1 or more."
            });
        }
        property.rooms = rooms;
    }
    if (location !== undefined) {
        property.location = location.toLowerCase();
    }
    if (type !== undefined) {
        const lowerCaseType = type.toLowerCase();
        if (!PROPERTY_TYPES.includes(lowerCaseType)) {
            return res.status(400).json({
                success: false,
                error: `Invalid property type. Allowed types are: ${PROPERTY_TYPES.join(', ')}`
            });
        }
        property.type = lowerCaseType;
    }
    if (isAvailable !== undefined) property.isAvailable = isAvailable;
    
    // Update squareFeet if provided
    if (squareFeet !== undefined) {
        property.squareFeet = squareFeet ? Number(squareFeet) : undefined;
    }

    // Area update logic: Uniqueness check
    const newLowerCaseArea = area ? area.toLowerCase() : undefined;
    if (newLowerCaseArea !== undefined && newLowerCaseArea !== property.area) { // Agar area change ho raha hai
        const existingPropertyInNewArea = await Property.findOne({
            location: (location || property.location).toLowerCase(), // Nayi location ya purani
            area: newLowerCaseArea,
            _id: { $ne: id } // Existing property ko ignore karein
        });

        if (existingPropertyInNewArea) {
            return res.status(409).json({
                success: false,
                error: `An area '${newLowerCaseArea}' already exists in location '${(location || property.location)}'. Please choose a different area.`
            });
        }
        property.area = newLowerCaseArea;
    } else if (newLowerCaseArea === '') { // Agar area ko empty string kiya ja raha hai
        property.area = undefined; // Ya null
    }

    // Handle images - start with a clean slate
    let finalImages = [];
    
    // Parse existing images if provided
    if (existingImages) {
        try {
            const parsedExistingImages = JSON.parse(existingImages);
            if (Array.isArray(parsedExistingImages)) {
                finalImages = parsedExistingImages;
            }
        } catch (error) {
            console.error("Failed to parse existingImages:", error);
        }
    }
    
    // Handle image deletion for images not in the existingImages array
    const currentImages = property.images;
    const existingPublicIds = finalImages.map(img => img.public_id);
    
    // Find images to delete (images that are in currentImages but not in existingImages)
    const imagesToDeleteFromCloud = currentImages
        .filter(img => !existingPublicIds.includes(img.public_id))
        .map(img => img.public_id);
    
    // Delete images from Cloudinary
    for (const publicId of imagesToDeleteFromCloud) {
        await deleteFromCloudinary(publicId);
    }
    
    // Upload new images if any
    if (req.files && req.files.length > 0) {
        const uploadedNewImages = [];
        for (const file of req.files) {
            const cloudinaryResponse = await uploadOnCloudinary(file.path);
            if (cloudinaryResponse && cloudinaryResponse.url && cloudinaryResponse.public_id) {
                uploadedNewImages.push({
                    url: cloudinaryResponse.url,
                    public_id: cloudinaryResponse.public_id
                });
            } else {
                // Agar koi image upload fail ho jaye to error aur previously uploaded new images ko delete karein
                for (const img of uploadedNewImages) {
                    await deleteFromCloudinary(img.public_id);
                }
                return res.status(500).json({
                    success: false,
                    error: `Failed to upload new image: ${file.originalname}.`
                });
            }
        }
        
        // Add newly uploaded images to finalImages
        finalImages = [...finalImages, ...uploadedNewImages];
    }
    
    // Update property with final image array
    property.images = finalImages;

    await property.save({ runValidators: true }); // Schema validators ko run karein

    return res.status(200).json({
        success: true,
        message: "Property safalta-poorvak update ho gayi.",
        data: property
    });
});

/**
 * @desc Delete a property
 * @route DELETE /api/properties/:id
 * @access Private (Seller, Admin)
 */
export const deleteProperty = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id; // Logged-in user ki ID
    const userRole = req.user.role; // Logged-in user ka role

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            error: "Invalid Property ID."
        });
    }

    const property = await Property.findById(id);

    if (!property) {
        return res.status(404).json({
            success: false,
            error: "Property nahi mili."
        });
    }

    // Authorization: Admin koi bhi delete kar sakta hai, Seller sirf apni property
    if (userRole !== 'admin' && property.owner.toString() !== userId.toString()) {
        return res.status(403).json({
            success: false,
            error: "Forbidden: Aapko is property ko delete karne ki ijazat nahi hai."
        });
    }

    // Cloudinary se saari images delete karein
    for (const image of property.images) {
        await deleteFromCloudinary(image.public_id);
    }

    await Property.findByIdAndDelete(id);

    return res.status(200).json({
        success: true,
        message: "Property safalta-poorvak delete ho gayi.",
        data: {}
    });
});
