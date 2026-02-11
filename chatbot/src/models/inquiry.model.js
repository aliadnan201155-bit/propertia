import mongoose, { Schema } from "mongoose";

const inquirySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/.+@.+\..+/, 'Please fill a valid email address']
        },
        phone: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        property: { // Naya field: Property reference
            type: Schema.Types.ObjectId,
            ref: "Property",
            required: false, // Optional agar inquiry kisi property se related na ho, lekin yahan required rakhte hain
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        // Optional admin response tracking
        adminResponse: {
            type: String,
            default: null,
        },
        respondedAt: {
            type: Date,
            default: null,
        },
        respondedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true
    }
);

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
