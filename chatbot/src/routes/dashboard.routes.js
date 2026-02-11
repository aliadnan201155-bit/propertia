import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { sellerDashboardStats, adminDashboardStats } from '../controllers/dashboard.controller.js';

const router = Router();

// Seller dashboard stats
router.get('/seller', verifyToken, authorizeRoles('seller'), sellerDashboardStats);

// Admin dashboard stats
router.get('/admin', verifyToken, authorizeRoles('admin'), adminDashboardStats);

export default router;