import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        property: {
            type: Schema.Types.ObjectId,
            ref: "Property", // Assuming you will have a Property model
            required: true,
        },
        reviewer: {
            type: Schema.Types.ObjectId,
            ref: "User", // User model se reference
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1, // Minimum rating 1 star
            max: 5, // Maximum rating 5 stars
            validate: {
                validator: Number.isInteger, // Ensure rating is an integer
                message: 'Rating must be an integer between 1 and 5.'
            }
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 500, // Review comment ki maximum length
        },
    },
    {
        timestamps: true // createdAt aur updatedAt fields automatically add karega
    }
);

// Har property ke liye ek user sirf ek review de sake
reviewSchema.index({ property: 1, reviewer: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
