// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../services/user.service';

const sendSuccess = (res: Response, data: any, statusCode = 200) => {
  res.status(statusCode).json(data);
};

const sendError = (res: Response, message: string, statusCode = 400) => {
  res.status(statusCode).json({ message });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    sendSuccess(res, user, 201);
  } catch (error: any) {
    console.error('🚨 User Registration Error:', error);
    sendError(res, error.message || 'Registration failed', 400);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    
    if (!Array.isArray(users)) {
      console.error('❌ getAllUsers() did not return an array:', users);
      return sendError(res, 'Invalid user data format', 500);
    }

    sendSuccess(res, users);
  } catch (error: any) {
    console.error('🚨 Fetch Users Error:', error);
    sendError(res, error.message || 'Failed to fetch users', 500);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return sendError(res, 'User ID is required', 400);
    }

    const user = await getUserById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, user);
  } catch (error: any) {
    console.error('🚨 Fetch User Error:', error);
    sendError(res, error.message || 'Failed to fetch user', 500);
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return sendError(res, 'User ID is required', 400);
    }

    const updatedUser = await updateUser(id, req.body);
    if (!updatedUser) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, updatedUser);
  } catch (error: any) {
    console.error('🚨 Update User Error:', error);
    sendError(res, error.message || 'Failed to update user', 400);
  }
};

export const deleteUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return sendError(res, 'User ID is required', 400);
    }

    const user = await deleteUser(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, { message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('🚨 Delete User Error:', error);
    sendError(res, error.message || 'Failed to delete user', 500);
  }
};