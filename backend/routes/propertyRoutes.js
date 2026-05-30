import express from 'express';
import { searchProperties, getLocationTrends, getPublicStats } from '../controller/propertyController.js';

const router = express.Router();

// Route to search for properties
router.post('/properties/search', searchProperties);

// Route to get location trends
router.get('/locations/:city/trends', getLocationTrends);

// Public stats for homepage hero section
router.get('/public/stats', getPublicStats);

export default router;