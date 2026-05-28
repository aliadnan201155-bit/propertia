import fs from "fs";
import imagekit from "../config/imagekit.js";
import Property from "../models/propertymodel.js";
import User from "../models/Usermodel.js";
import { Parser } from "@json2csv/plainjs";

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const addproperty = async (req, res) => {
  try {
    let {
      title,
      location,
      price,
      beds,
      baths,
      sqft,
      type,
      availability,
      description,
      amenities,
      phone,
    } = req.body;

    // Parse amenities if it's a JSON string (sent from frontend)
    if (typeof amenities === "string") {
      try {
        amenities = JSON.parse(amenities);
      } catch (e) {
        console.error("Error parsing amenities:", e);
        amenities = [];
      }
    }
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    // Upload images to ImageKit and delete after upload
    const imageUrls = await Promise.all(
      images.map(async (item) => {
        const result = await imagekit.upload({
          file: fs.readFileSync(item.path),
          fileName: item.originalname,
          folder: "Property",
        });
        fs.unlink(item.path, (err) => {
          if (err) console.log("Error deleting the file: ", err);
        });
        return result.url;
      }),
    );

    // Create a new product with userId from authenticated user
    const product = new Property({
      title,
      location,
      price,
      beds,
      baths,
      sqft,
      type,
      availability,
      description,
      amenities,
      image: imageUrls,
      phone,
      userId: req.user._id,
    });

    // Save the product to the database
    await product.save();

    res.json({ message: "Product added successfully", success: true });
  } catch (error) {
    console.log("Error adding product: ", error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

const listproperty = async (req, res) => {
  try {
    // Only get properties for the authenticated user (ADMIN PANEL)
    const property = await Property.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ property, success: true });
  } catch (error) {
    console.log("Error listing products: ", error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

const exportPropertiesCsv = async (req, res) => {
  try {
    const property = await Property.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    const json2csvParser = new Parser({
      fields: ['title', 'location', 'price', 'beds', 'baths', 'sqft', 'type', 'availability', 'description', 'amenities', 'phone', 'createdAt']
    });
    const csv = json2csvParser.parse(property);

    res.header("Content-Type", "text/csv");
    res.attachment("property.csv");
    return res.send(csv);
  } catch (error) {
    console.log("Error exporting properties: ", error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

const publicListProperty = async (req, res) => {
  try {
    // Get ALL properties for public browsing (FRONTEND)
    const property = await Property.find().sort({ createdAt: -1 });
    res.json({ property, success: true });
  } catch (error) {
    console.log("Error listing products: ", error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

const removeproperty = async (req, res) => {
  try {
    // Only allow user to delete their own property
    const property = await Property.findOneAndDelete({
      _id: req.body.id,
      userId: req.user._id,
    });
    if (!property) {
      return res.status(404).json({
        message: "Property not found or you don't have permission to delete it",
        success: false,
      });
    }
    return res.json({
      message: "Property removed successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error removing product: ", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

const updateproperty = async (req, res) => {
  try {
    let {
      id,
      title,
      location,
      price,
      beds,
      baths,
      sqft,
      type,
      availability,
      description,
      amenities,
      phone,
    } = req.body;

    // Parse amenities if it's a JSON string (sent from frontend)
    if (typeof amenities === "string") {
      try {
        amenities = JSON.parse(amenities);
      } catch (e) {
        console.error("Error parsing amenities:", e);
        amenities = [];
      }
    }

    // Admins can update any property; others can update only their own
    const property = req.user?.role === "admin"
      ? await Property.findById(id)
      : await Property.findOne({ _id: id, userId: req.user._id });
    if (!property) {
      console.log("Property not found with ID:", id); // Debugging line
      return res.status(404).json({
        message: "Property not found or you don't have permission to update it",
        success: false,
      });
    }

    if (!req.files) {
      // No new images provided
      property.title = title;
      property.location = location;
      property.price = price;
      property.beds = beds;
      property.baths = baths;
      property.sqft = sqft;
      property.type = type;
      property.availability = availability;
      property.description = description;
      property.amenities = amenities;
      property.phone = phone;
      // Keep existing images
      await property.save();
      return res.json({
        message: "Property updated successfully",
        success: true,
      });
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    // Only upload and update images if new ones were provided
    if (images.length > 0) {
      // Upload images to ImageKit and delete after upload
      const imageUrls = await Promise.all(
        images.map(async (item) => {
          const result = await imagekit.upload({
            file: fs.readFileSync(item.path),
            fileName: item.originalname,
            folder: "Property",
          });
          fs.unlink(item.path, (err) => {
            if (err) console.log("Error deleting the file: ", err);
          });
          return result.url;
        }),
      );
      property.image = imageUrls; // Only update images if new ones uploaded
    }
    // If no new images, keep existing images (don't update property.image)
    property.title = title;
    property.location = location;
    property.price = price;
    property.beds = beds;
    property.baths = baths;
    property.sqft = sqft;
    property.type = type;
    property.availability = availability;
    property.description = description;
    property.amenities = amenities;
    property.phone = phone;

    await property.save();
    res.json({ message: "Property updated successfully", success: true });
  } catch (error) {
    console.log("Error updating product: ", error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

const singleproperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id).populate("userId", "name email");
    if (!property) {
      return res
        .status(404)
        .json({ message: "Property not found", success: false });
    }
    res.json({ property, success: true });
  } catch (error) {
    console.log("Error fetching property:", error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

// Admin-only CRUD Controllers

const adminListProperties = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const search = (req.query.search || "").trim();

    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { type: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [properties, total, overallStats] = await Promise.all([
      Property.find(filter)
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Property.countDocuments(filter),
      Property.aggregate([
        {
          $group: {
            _id: null,
            totalProperties: { $sum: 1 },
            rentProperties: {
              $sum: { $cond: [{ $eq: ["$availability", "rent"] }, 1, 0] },
            },
            buyProperties: {
              $sum: { $cond: [{ $eq: ["$availability", "buy"] }, 1, 0] },
            },
            averagePrice: { $avg: "$price" },
          },
        },
      ]),
    ]);

    const stats = overallStats?.[0] || {
      totalProperties: 0,
      rentProperties: 0,
      buyProperties: 0,
      averagePrice: 0,
    };

    return res.json({
      success: true,
      properties,
      stats,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error listing properties:", error);
    return res.status(500).json({ success: false, message: "Error listing properties" });
  }
};

const adminGetPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "userId",
      "name email role"
    );
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    return res.json({ success: true, property });
  } catch (error) {
    console.error("Error fetching property:", error);
    return res.status(500).json({ success: false, message: "Error fetching property" });
  }
};

const adminCreateProperty = async (req, res) => {
  try {
    const {
      title,
      location,
      price,
      image,
      beds,
      baths,
      sqft,
      type,
      availability,
      description,
      amenities,
      phone,
      userId,
    } = req.body;

    if (
      !title ||
      !location ||
      price === undefined ||
      !Array.isArray(image) ||
      image.length === 0 ||
      beds === undefined ||
      baths === undefined ||
      sqft === undefined ||
      !type ||
      !availability ||
      !description ||
      !Array.isArray(amenities) ||
      !phone ||
      !userId
    ) {
      return res.status(400).json({
        success: false,
        message: "All property fields are required and must be valid",
      });
    }

    const owner = await User.findById(userId);
    if (!owner) {
      return res.status(404).json({ success: false, message: "Owner user not found" });
    }

    const property = await Property.create({
      title,
      location,
      price,
      image,
      beds,
      baths,
      sqft,
      type,
      availability,
      description,
      amenities,
      phone,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    return res.status(500).json({ success: false, message: "Error creating property" });
  }
};

const adminUpdateProperty = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.userId) {
      const owner = await User.findById(updates.userId);
      if (!owner) {
        return res.status(404).json({ success: false, message: "Owner user not found" });
      }
    }

    const property = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    return res.json({
      success: true,
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({ success: false, message: "Error updating property" });
  }
};

const adminDeleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    return res.json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return res.status(500).json({ success: false, message: "Error deleting property" });
  }
};

export {
  addproperty,
  listproperty,
  publicListProperty,
  removeproperty,
  updateproperty,
  exportPropertiesCsv,
  singleproperty,
  adminListProperties,
  adminGetPropertyById,
  adminCreateProperty,
  adminUpdateProperty,
  adminDeleteProperty,
};
