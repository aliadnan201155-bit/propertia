import mongoose, { Schema } from "mongoose";

// Dynamic locations - Any location can be added, no hardcoded restrictions
// Locations are automatically populated from database entries
const PROPERTY_TYPES = [
    'flat',
    'house'
];


const propertySchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        price: {
            type: Number,
            required: true,
            min: 0, // Price zero ya us se zyada honi chahiye
        },
        location: { // Dynamic location - any location accepted (e.g., DHA, Gulberg, Marwari Line, etc.)
            type: String,
            required: true,
            trim: true,
            lowercase: true, // Store in lowercase for consistency in search
            // No enum restriction - allows any location to be added dynamically
        },
        area: { // Seller-defined area within the predefined location (e.g., Phase 5, Block A)
            type: String,
            trim: true,
            lowercase: true, // Sab small caps mein store hoga
            // Required false isliye kyunki har location mein area sub-division na ho
            // Iski uniqueness controller mein handle hogi (location ke andar unique)
        },
        squareFeet: { // Property size in square feet
            type: Number,
            min: 0,
            // Optional field for property size
        },
        rooms: {
            type: Number,
            required: true,
            min: 1, // Minimum 1 room
            validate: {
                validator: Number.isInteger,
                message: 'Rooms must be an integer.'
            }
        },
        type: { // Flat ya House
            type: String,
            required: true,
            trim: true,
            enum: PROPERTY_TYPES,
        },
        images: [ // Array of Cloudinary URLs for property images
            {
                url: {
                    type: String, // Cloudinary image URL
                    required: true,
                },
                public_id: {
                    type: String, // Cloudinary public ID for deletion
                    required: true,
                }
            }
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User", // Property ka owner (Seller ki ID)
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "rented", "inactive", "sold"],
            default: "active"
        },
        isAvailable: {
            type: Boolean,
            default: true, // By default, property available hogi
        },
    },
    {
        timestamps: true
    }
);

// Location aur area ka combination unique hona chahiye (optional, agar har area unique ho regardless of owner)
// Ya phir, owner, location, aur area ka combination unique ho agar ek seller multiple bar same area add kar sakta ho.
// Abhi ke liye, hum controller mein check lagayenge ke is location mein ye area pehle se exist na karta ho.
propertySchema.index({ location: 1, area: 1 }, { unique: true, sparse: true }); // area optional ho sakta hai, isliye sparse

export const Property = mongoose.model("Property", propertySchema);
