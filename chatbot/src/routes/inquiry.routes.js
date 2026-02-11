import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js'; // Apne auth middleware ka path verify karein
import { authorizeRoles } from '../middlewares/role.middleware.js'; // Apne authorization middleware ka path verify karein
import {
    submitInquiry,
    getAllInquiries,
    markInquiryAsRead,
    respondToInquiry,
    getUnreadInquiriesCount,
} from '../controllers/inquiry.controller.js'; // Apne inquiry controller ka path verify karein

const router = Router();

// Inquiry form submit karein (Har koi submit kar sakta hai)
router.route('/').post(submitInquiry);

// Sabhi inquiries hasil karein (Sirf Admin dekh sakta hai)
router.route('/').get(
    verifyToken,
    authorizeRoles('admin'),
    getAllInquiries
);

// Ek inquiry ko 'read' mark karein (Sirf Admin)
router.route('/:id/read').put(
    verifyToken,
    authorizeRoles('admin'),
    markInquiryAsRead
);

// Admin responds to an inquiry (send custom email to inquirer)
router.route('/:id/respond').put(
    verifyToken,
    authorizeRoles('admin'),
    respondToInquiry
);

// Unread inquiries ki ginti hasil karein (Sirf Admin, navbar badge ke liye)
router.route('/unread/count').get(
    verifyToken,
    authorizeRoles('admin'),
    getUnreadInquiriesCount
);

export default router;
