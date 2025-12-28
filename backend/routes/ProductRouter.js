import express from 'express';
import { addproperty, listproperty, publicListProperty, removeproperty, updateproperty, singleproperty } from '../controller/productcontroller.js';
import upload from '../middleware/multer.js';
import { protect } from '../middleware/authmiddleware.js';

const propertyrouter = express.Router();

// Public routes (no authentication)
propertyrouter.get('/public/list', publicListProperty);
propertyrouter.get('/single/:id', singleproperty);

// Protected routes (require authentication)
propertyrouter.post('/add', protect, upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]), addproperty);
propertyrouter.get('/list', protect, listproperty);
propertyrouter.post('/remove', protect, removeproperty);
propertyrouter.post('/update', protect, upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]), updateproperty);

export default propertyrouter;