import express from 'express';
import {
  login,
  register,
  forgotpassword,
  adminlogin,
  resetpassword,
  getProfile,
  verifyToken,
  logout,
  adminListUsers,
  adminGetUserById,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
} from '../controller/Usercontroller.js';
import authMiddleware, { requireAdmin } from '../middleware/authmiddleware.js';


const userrouter = express.Router();

userrouter.post('/login', login);
userrouter.post('/register', register);
userrouter.post('/forgot', forgotpassword);
userrouter.post('/reset/:token', resetpassword);
userrouter.post('/admin', adminlogin);
userrouter.post('/logout', logout);
userrouter.get('/me', authMiddleware, getProfile);
userrouter.get('/verify-token', verifyToken);

// Admin-only CRUD routes
userrouter.get('/manage/users', authMiddleware, requireAdmin, adminListUsers);
userrouter.get('/manage/users/:id', authMiddleware, requireAdmin, adminGetUserById);
userrouter.post('/manage/users', authMiddleware, requireAdmin, adminCreateUser);
userrouter.put('/manage/users/:id', authMiddleware, requireAdmin, adminUpdateUser);
userrouter.delete('/manage/users/:id', authMiddleware, requireAdmin, adminDeleteUser);

export default userrouter;