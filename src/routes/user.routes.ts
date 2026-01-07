// src/routes/user.routes.ts
import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateToken } from '../utils/auth';

const userRouter = Router();

/**
 * @route   POST /api/user/register
 * @desc    Register a full user profile (admin/manager use only)
 * @access  Public (but typically used only after auth for admin-created profiles)
 */
userRouter.post('/register', userController.registerUser);

/**
 * @route   GET /api/user
 * @desc    Get all users
 * @access  Private (requires JWT)
 */
userRouter.get('/', authenticateToken, userController.getUsers);

/**
 * @route   GET /api/user/:id
 * @desc    Get single user by ID
 * @access  Private
 */
userRouter.get('/:id', authenticateToken, userController.getUser);

/**
 * @route   PUT /api/user/:id
 * @desc    Update user profile
 * @access  Private
 */
userRouter.put('/:id', authenticateToken, userController.updateUserProfile);

/**
 * @route   DELETE /api/user/:id
 * @desc    Delete user
 * @access  Private
 */
userRouter.delete('/:id', authenticateToken, userController.deleteUserProfile);

export default userRouter;