import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js'; // Path updated to 'middlewares'
import { authorizeRoles } from '../middlewares/role.middleware.js'; // Path updated to 'middlewares' and filename to 'role.middleware.js'
import {
    addReview,
    getPropertyReviews,
    deleteReview,
    getAllReviews,
} from '../controllers/review.controller.js';

const router = Router();

// Get all reviews (for testimonials) - Public
router.route('/').get(getAllReviews);

// Review add karne ke liye (Buyer ya Seller)
router.route('/').post(
    verifyToken,
    authorizeRoles('buyer', 'seller', 'admin'), // Admin bhi review de sakta hai agar zarurat ho
    addReview
);

// Ek property ke reviews dekhne ke liye (Public - anyone can view)
// Agar aap reviews dekhne ke liye login zaroori nahi rakhna chahte to 'verifyJWT' aur 'authorizeRoles' hata dein
router.route('/:propertyId').get(
    // verifyToken, // Optional: agar login zaroori ho reviews dekhne ke liye
    // authorizeRoles('buyer', 'seller', 'admin'), // Optional
    getPropertyReviews
);


// Review delete karne ke liye (Admin ya Reviewer jisne review diya hai)
router.route('/:reviewId').delete(
    verifyToken,
    authorizeRoles('admin', 'buyer', 'seller'), // Admin koi bhi delete kar sakta hai, buyer/seller apna review delete kar saken ge
    deleteReview
);

export default router;
