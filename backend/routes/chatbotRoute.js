import express from 'express';
import { chat } from '../controller/chatbotController.js';

const router = express.Router();

// POST /api/chatbot
router.post('/', chat);

export default router;
