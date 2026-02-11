import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js'; // Apne auth middleware ka path verify karein
import { authorizeRoles } from '../middlewares/role.middleware.js'; // Apne authorization middleware ka path verify karein
import {
    addFAQ,
    getAllFAQs,
    deleteFAQ,
    updateFAQ
} from '../controllers/faq.controller.js'; // Apne faq controller ka path verify karein

const router = Router();

// FAQ add karne ke liye (Sirf Admin)
router.route('/').post(
    verifyToken,
    authorizeRoles('admin'), // Sirf admin hi FAQ add kar sakta hai
    addFAQ
);

// Sab FAQs dekhne ke liye (Public - anyone can view)
router.route('/').get(getAllFAQs);

// FAQ update karne ke liye (Sirf Admin)
router.route('/:id').put(
    verifyToken,
    authorizeRoles('admin'), // Sirf admin hi FAQ update kar sakta hai
    updateFAQ
);

// FAQ delete karne ke liye (Sirf Admin)
router.route('/:id').delete(
    verifyToken,
    authorizeRoles('admin'), // Sirf admin hi FAQ delete kar sakta hai
    deleteFAQ
);

export default router;
