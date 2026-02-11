import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Review } from '../models/review.model.js'; // Review model ko import karein
import { sendEmail, templates } from '../utils/email.js';
import mongoose from 'mongoose'; // Added mongoose import
// import { Property } from '../models/property.model.js'; // Agar Property model available ho to uncomment karein

/**
 * @desc Add a new review for a property
 * @route POST /api/reviews
 * @access Private (Buyer, Seller)
 */
export const addReview = asyncHandler(async (req, res) => {
    const { property, rating, comment } = req.body;
    const reviewer = req.user._id; // Review denay wala user (auth middleware se aayega)

    // Validation
    if (!property || !rating) {
        throw new ApiError(400, "Property ID and Rating are required.");
    }
    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5.");
    }

    // Optional: Check if the property exists
    // const existingProperty = await Property.findById(property);
    // if (!existingProperty) {
    //     throw new ApiError(404, "Property not found.");
    // }

    // Check if user has already reviewed this property
    const existingReview = await Review.findOne({ property, reviewer });
    if (existingReview) {
        throw new ApiError(409, "You have already submitted a review for this property.");
    }

    const review = await Review.create({
        property,
        reviewer,
        rating,
        comment,
    });

    if (!review) {
        throw new ApiError(500, "Failed to add review. Please try again.");
    }

    // Send acknowledgement email to reviewer
    try {
        const tpl = templates.reviewAck({ fullName: req.user?.fullName });
        const info = await sendEmail({ to: req.user.email, subject: tpl.subject, text: tpl.text });
        if (info?.previewUrl) console.info('Review ack preview:', info.previewUrl);
    } catch (err) {
        console.error('Failed to send review ack email:', err.message || err);
    }

    return res.status(201).json(new ApiResponse(201, review, "Review added successfully."));
});

/**
 * @desc Get all reviews (for testimonials)
 * @route GET /api/reviews
 * @access Public
 */
export const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find()
        .populate('reviewer', 'email fullName') // Reviewer ki details load karein
        .populate('property', 'title location images') // Property details bhi load karein
        .sort({ createdAt: -1 }); // Naye reviews pehle show honge

    return res.status(200).json(new ApiResponse(200, reviews, "All reviews fetched successfully."));
});

/**
 * @desc Get all reviews for a specific property
 * @route GET /api/reviews/:propertyId
 * @access Public
 */
export const getPropertyReviews = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;

    // Optional: Property ID validation
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
        throw new ApiError(400, "Invalid property ID.");
    }

    const reviews = await Review.find({ property: propertyId })
        .populate('reviewer', 'email fullName') // Reviewer ki details load karein
        .sort({ createdAt: -1 }); // Naye reviews pehle show honge

    if (!reviews) {
        throw new ApiError(404, "No reviews found for this property.");
    }

    return res.status(200).json(new ApiResponse(200, reviews, "Property reviews fetched successfully."));
});

/**
 * @desc Delete a review (Admin only) or allow reviewer to delete their own
 * @route DELETE /api/reviews/:reviewId
 * @access Private (Admin, Reviewer)
 */
export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id; // Logged-in user ki ID
    const userRole = req.user.role; // Logged-in user ka role

    // Optional: Review ID validation
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ApiError(400, "Invalid review ID.");
    }

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found.");
    }

    // Authorization: Admin delete kar sakta hai, ya reviewer apna review delete kar sakta hai
    if (userRole === 'admin' || review.reviewer.toString() === userId.toString()) {
        await Review.findByIdAndDelete(reviewId);
        return res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully."));
    } else {
        throw new ApiError(403, "Forbidden: You are not authorized to delete this review.");
    }
});
