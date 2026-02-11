import mongoose, { Schema } from "mongoose";

const faqSchema = new Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
            unique: true, // Har FAQ ka sawal unique hona chahiye
        },
        answer: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true // createdAt aur updatedAt fields automatically add karega
    }
);

export const FAQ = mongoose.model("FAQ", faqSchema);