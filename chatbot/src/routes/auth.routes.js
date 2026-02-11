import express from 'express';
import { 
  register, 
  login, 
  logout, 
  changePassword, 
  updateProfile, 
  refreshAccessToken,
  getCurrentUser
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.put('/change-password', verifyToken, changePassword);
router.put('/update-profile', verifyToken, updateProfile);
router.post('/refresh-token', refreshAccessToken);
router.get('/current-user', verifyToken, getCurrentUser);

export default router;