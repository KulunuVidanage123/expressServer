// src/routes/user.routes.ts
import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateToken } from '../utils/auth';

const userRouter = Router();

/**
 * @route   POST /api/user/register
 * @desc    Create a new dashboard user profile (admin-created)
 * @access  Private (requires JWT authentication)
 * @note    This endpoint creates users with source: 'dashboard'
 *          and does NOT require a password field
 */
userRouter.post('/register', authenticateToken, userController.registerUser);

/**
 * @route   GET /api/user
 * @desc    Get all DASHBOARD users (excludes auth-registered users)
 * @access  Private (requires JWT)
 * @note    Only returns users with source: 'dashboard'
 */
userRouter.get('/', authenticateToken, userController.getUsers);

/**
 * @route   GET /api/user/:id
 * @desc    Get single user by ID (any source)
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