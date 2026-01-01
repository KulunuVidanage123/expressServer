import { Request, Response } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../services/user.service';
import { SUCCESS, ERROR } from '../utils/helper';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    SUCCESS(res, { code: 201, message: 'User registered successfully' }, user);
  } catch (error: any) {
    ERROR(res, { statusCode: 400, message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    SUCCESS(res, { code: 200, message: 'Users fetched successfully' }, users);
  } catch (error: any) {
    ERROR(res, { statusCode: 500, message: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return ERROR(res, { statusCode: 404, message: 'User not found' });
    }
    SUCCESS(res, { code: 200, message: 'User fetched successfully' }, user);
  } catch (error: any) {
    ERROR(res, { statusCode: 500, message: error.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUser(id, req.body); // ← passes partial data

    if (!updatedUser) {
      return ERROR(res, { statusCode: 404, message: 'User not found' });
    }

    SUCCESS(res, { code: 200, message: 'User updated successfully' }, updatedUser);
  } catch (error: any) {
    // Log the actual error for debugging
    console.error('Update error:', error);
    ERROR(res, { statusCode: 400, message: error.message || 'Failed to update user' });
  }
};

export const deleteUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await deleteUser(id);

    if (!user) {
      return ERROR(res, { statusCode: 404, message: 'User not found' });
    }

    SUCCESS(res, { code: 200, message: 'User deleted successfully' }, user);
  } catch (error: any) {
    // Log the actual error for debugging
    console.error('Delete error:', error);
    ERROR(res, { statusCode: 500, message: error.message || 'Failed to delete user' });
  }
};