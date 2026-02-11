import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { FAQ } from '../models/faq.model.js'; 
import mongoose from 'mongoose';

/**
 * @desc Add a new FAQ
 * @route POST /api/faqs
 * @access Private (Admin only)
 */
export const addFAQ = asyncHandler(async (req, res) => {
    const { question, answer } = req.body;

    // Validation
    if (!question?.trim() || !answer?.trim()) {
        throw new ApiError(400, "Question and Answer are required for FAQ.");
    }

    // Check if FAQ with same question already exists
    const existingFAQ = await FAQ.findOne({ question });
    if (existingFAQ) {
        throw new ApiError(409, "FAQ with this question already exists.");
    }

    const faq = await FAQ.create({
        question,
        answer,
    });

    if (!faq) {
        throw new ApiError(500, "Failed to add FAQ. Please try again.");
    }

    return res.status(201).json(new ApiResponse(201, faq, "FAQ added successfully."));
});

/**
 * @desc Get all FAQs
 * @route GET /api/faqs
 * @access Public
 */
export const getAllFAQs = asyncHandler(async (req, res) => {
    const faqs = await FAQ.find().sort({ createdAt: 1 }); // Naye FAQs pehle show honge ya creation order mein

    // Return empty array instead of throwing error when no FAQs found
    return res.status(200).json(new ApiResponse(200, faqs || [], "FAQs fetched successfully."));
});

/**
 * @desc Update an existing FAQ
 * @route PUT /api/faqs/:id
 * @access Private (Admin only)
 */
export const updateFAQ = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;

    // Validate FAQ ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid FAQ ID.");
    }

    // Validate input
    if (!question?.trim() || !answer?.trim()) {
        throw new ApiError(400, "Question and Answer are required for FAQ.");
    }

    // Find the FAQ to update
    const faq = await FAQ.findById(id);
    if (!faq) {
        throw new ApiError(404, "FAQ not found.");
    }

    // Check if another FAQ with the same question exists (excluding current FAQ)
    if (question !== faq.question) {
        const existingFAQ = await FAQ.findOne({ 
            question, 
            _id: { $ne: id } 
        });
        
        if (existingFAQ) {
            throw new ApiError(409, "Another FAQ with this question already exists.");
        }
    }

    // Update the FAQ
    const updatedFAQ = await FAQ.findByIdAndUpdate(
        id,
        { question, answer },
        { new: true, runValidators: true }
    );

    if (!updatedFAQ) {
        throw new ApiError(500, "Failed to update FAQ. Please try again.");
    }

    return res.status(200).json(new ApiResponse(200, updatedFAQ, "FAQ updated successfully."));
});

/**
 * @desc Delete an FAQ (Admin only)
 * @route DELETE /api/faqs/:id
 * @access Private (Admin only)
 */
export const deleteFAQ = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Optional: FAQ ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid FAQ ID.");
    }

    const faq = await FAQ.findById(id);

    if (!faq) {
        throw new ApiError(404, "FAQ not found.");
    }

    await FAQ.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, {}, "FAQ deleted successfully."));
});
