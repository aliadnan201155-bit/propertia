import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Inquiry } from '../models/inquiry.model.js';
import mongoose from 'mongoose';
import { sendEmail, templates } from '../utils/email.js';

/**
 * @desc Ek naya inquiry form submit karein
 * @route POST /api/inquiries
 * @access Public (Har koi submit kar sakta hai)
 */
export const submitInquiry = asyncHandler(async (req, res) => {
    const { name, email, message, phone, propertyId } = req.body; // propertyId add kiya

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim() || !phone?.trim()) {
        throw new ApiError(400, "All fields are required.");
    }
    // propertyId ka validation, agar diya gaya hai to valid ObjectId ho
    if (propertyId && !mongoose.Types.ObjectId.isValid(propertyId)) {
        throw new ApiError(400, "Invalid Property ID provided for inquiry.");
    }

    const inquiry = await Inquiry.create({
        name,
        email,
        phone,
        message,
        property: propertyId, // Property ID ko save karein
    });

    if (!inquiry) {
        throw new ApiError(500, "Failed to submit inquiry.");
    }

    // Send acknowledgement to user (non-blocking but await to catch errors)
    try {
        const tplUser = templates.inquiryAck({ name: inquiry.name });
        const userMail = await sendEmail({ to: inquiry.email, subject: tplUser.subject, text: tplUser.text });
        // Log preview URL if available
        if (userMail?.previewUrl) console.info('Inquiry ack preview:', userMail.previewUrl);
    } catch (err) {
        console.error('Failed to send inquiry ack email:', err.message || err);
    }

    // Notify admin
    try {
        const tplAdmin = templates.inquiryNotificationToAdmin({
            name: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone,
            message: inquiry.message,
            property: inquiry.property,
            inquiryId: inquiry._id,
        });
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
            const adminMail = await sendEmail({ to: adminEmail, subject: tplAdmin.subject, text: tplAdmin.text });
            if (adminMail?.previewUrl) console.info('Inquiry admin preview:', adminMail.previewUrl);
        } else {
            console.warn('ADMIN_EMAIL not configured; skipping admin notification email');
        }
    } catch (err) {
        console.error('Failed to send inquiry notification to admin:', err.message || err);
    }

    return res.status(201).json(new ApiResponse(201, inquiry, "Inquiry submitted successfully."));
});

/**
 * @desc Sabhi inquiries (unread aur read) hasil karein
 * @route GET /api/inquiries
 * @access Private (Sirf Admin)
 */
export const getAllInquiries = asyncHandler(async (req, res) => {
    const inquiries = await Inquiry.find()
        .populate('property', 'title location images') // Property details populate karein
        .sort({ createdAt: -1 });

    if (!inquiries || inquiries.length === 0) {
        throw new ApiError(404, "Koi inquiries nahi mili.");
    }

    return res.status(200).json(new ApiResponse(200, inquiries, "Sab inquiries safalta-poorvak hasil ho gayin."));
});

/**
 * @desc Ek inquiry ko 'read' mark karein
 * @route PUT /api/inquiries/:id/read
 * @access Private (Sirf Admin)
 */
export const markInquiryAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Inquiry ID.");
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
        throw new ApiError(404, "Inquiry nahi mili.");
    }

    if (inquiry.isRead) {
        return res.status(200).json(new ApiResponse(200, inquiry, "Inquiry pehle se hi 'read' mark hai."));
    }

    inquiry.isRead = true;
    await inquiry.save();

    return res.status(200).json(new ApiResponse(200, inquiry, "Inquiry 'read' mark kar di gayi hai."));
});

/**
 * @desc Unread inquiries ki ginti hasil karein (Navbar badge ke liye)
 * @route GET /api/inquiries/unread/count
 * @access Private (Sirf Admin)
 */
export const getUnreadInquiriesCount = asyncHandler(async (req, res) => {
    const unreadCount = await Inquiry.countDocuments({ isRead: false });

    return res.status(200).json(new ApiResponse(200, { count: unreadCount }, "Unread inquiries ki ginti safalta-poorvak hasil ho gayi."));
});

/**
 * @desc Admin responds to an inquiry via email
 * @route PUT /api/inquiries/:id/respond
 * @access Private (Admin)
 */
export const respondToInquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { responseMessage } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Inquiry ID.");
    }

    if (!responseMessage || !responseMessage.trim()) {
        throw new ApiError(400, 'responseMessage is required');
    }

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
        throw new ApiError(404, "Inquiry nahi mili.");
    }

    // Send email to the inquirer
    try {
        const subject = `Response to your inquiry`;
        const text = `Hello ${inquiry.name},\n\n${responseMessage}\n\nRegards,\n${req.user?.fullName || 'Admin'}`;
        const info = await sendEmail({ to: inquiry.email, subject, text });
        if (info?.previewUrl) console.info('RespondToInquiry preview:', info.previewUrl);
    } catch (err) {
        console.error('Failed to send response email to inquirer:', err.message || err);
        throw new ApiError(500, 'Failed to send response email');
    }

    // Persist response in DB
    inquiry.adminResponse = responseMessage;
    inquiry.respondedAt = new Date();
    inquiry.respondedBy = req.user?._id || inquiry.respondedBy;
    await inquiry.save();

    return res.status(200).json(new ApiResponse(200, inquiry, 'Response sent successfully'));
});
