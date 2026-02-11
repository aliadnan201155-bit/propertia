import express from 'express';
import { getAllUsers, getSingleUser, deleteUser } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', verifyToken, authorizeRoles('admin'), getAllUsers);
router.get('/:id', verifyToken, authorizeRoles('admin'), getSingleUser);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteUser);

export default router;