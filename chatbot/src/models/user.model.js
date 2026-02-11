import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        location: {
            type: String,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            enum: ['buyer', 'seller', 'admin'],
            default: 'buyer',
            required: true,
        },
        refreshToken: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

// Pre-save hook to hash password before saving (if modified)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check if the provided password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            role: this.role // Include role in token for authorization middleware
        },
        process.env.ACCESS_TOKEN_SECRET, // Ensure this env var is set
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // E.g., "1h"
        }
    );
};

// Method to generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET, // Ensure this env var is set
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY // E.g., "10d"
        }
    );
};

export const User = mongoose.model("User", userSchema);
