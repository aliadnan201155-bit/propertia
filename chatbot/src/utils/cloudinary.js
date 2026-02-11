import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // Node.js file system module

// Cloudinary configuration (environment variables se aayengi)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @desc Local file ko Cloudinary par upload karein
 * @param {string} localFilePath - Local file ka absolute path
 * @returns {object|null} - Uploaded file ka Cloudinary response object ya null agar upload fail ho
 */
export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Cloudinary par file upload karein
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect file type
        });

        // File upload hone ke baad local file ko delete karein
        fs.unlinkSync(localFilePath); // Sync version for simplicity, can use fs.promises.unlink for async
        return response;

    } catch (error) {
        // Local file ko delete karein agar upload fail ho jaye
        fs.unlinkSync(localFilePath);
        console.error("Cloudinary upload failed:", error);
        return null;
    }
};

/**
 * @desc Cloudinary se file delete karein
 * @param {string} publicId - Cloudinary public ID of the file
 * @returns {boolean} - True agar deletion successful ho, false agar fail ho
 */
export const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return false;

        const result = await cloudinary.uploader.destroy(publicId);

        // 'ok' status agar deletion successful ho
        return result.result === 'ok';

    } catch (error) {
        console.error("Cloudinary deletion failed:", error);
        return false;
    }
};
