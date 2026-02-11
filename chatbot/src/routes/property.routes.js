import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js'; // Apne auth middleware ka path verify karein
import { authorizeRoles } from '../middlewares/role.middleware.js'; // Apne authorization middleware ka path verify karein
import { upload } from '../middlewares/multer.middleware.js'; // Multer middleware
import {
    addProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getUsersProperties,
} from '../controllers/property.controller.js'; // Apne property controller ka path verify karein

const router = Router();

// Property add karne ke liye (Seller, Admin)
// 'upload.array('images', 10)' 10 images tak allow karega 'images' fieldname se
router.route('/').post(
    verifyToken,
    authorizeRoles('seller', 'admin'),
    upload.array('images', 10), // Max 10 images, field name 'images'
    addProperty
);

// Sabhi properties dekhne ke liye (Public, filters ke sath)
router.route('/').get(getAllProperties);

// Get user's properties (Seller only)
router.route('/user-properties').get(
    verifyToken,
    authorizeRoles('seller'),
    getUsersProperties
);

// Ek single property dekhne ke liye (Public)
router.route('/:id').get(getPropertyById);

// Property update karne ke liye (Seller, Admin)
// 'upload.array('images', 10)' -> Nayi images ke liye field name
// updateProperty controller mein 'imagesToDelete' bhi handle hoga
router.route('/:id').put(
    verifyToken,
    authorizeRoles('seller', 'admin'),
    upload.array('images', 10), // Max 10 new images
    updateProperty
);

// Property delete karne ke liye (Seller, Admin)
router.route('/:id').delete(
    verifyToken,
    authorizeRoles('seller', 'admin'),
    deleteProperty
);

export default router;
