import express from 'express';
import { chat } from '../controllers/chatbot.controller.js';

const router = express.Router();

// POST /api/chatbot
router.post('/', chat);

export default router;
