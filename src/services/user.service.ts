// src/services/user.service.ts
import { IUser } from '../models/user.model';
import UserModel from '../models/user.model'; 

const ALLOWED_UPDATE_FIELDS = [
  'firstName',
  'lastName',
  'age',
  'gender',
  'email',
  'phone',
  'dateOfBirth',
  'role',
  'department',
  'username',
  'imageUrl' 
];

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  if (!userData.email) {
    throw new Error('Email is required');
  }

  const existingUser = await UserModel.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User already registered');
  }

  const newUser = new UserModel(userData);
  return await newUser.save();
};

export const getAllUsers = async (filter: Record<string, any> = {}): Promise<IUser[]> => {
  try {
    const users = await UserModel.find(filter).select('-password');
    return users;
  } catch (error) {
    console.error('🔥 Service: getAllUsers failed', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  if (!id) {
    throw new Error('Valid user ID is required');
  }
  return await UserModel.findById(id).select('-password');
};

export const updateUser = async (
  id: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  if (!id) {
    throw new Error('User ID is required');
  }

  const filteredUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([key]) =>
      ALLOWED_UPDATE_FIELDS.includes(key)
    )
  );

  if (Object.keys(filteredUpdateData).length === 0) {
    throw new Error('No valid fields to update');
  }

  return await UserModel.findByIdAndUpdate(
    id,
    { $set: filteredUpdateData },
    { 
      new: true, 
      runValidators: true,
      context: 'query'
    }
  ).select('-password');
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  if (!id) {
    throw new Error('User ID is required');
  }
  return await UserModel.findByIdAndDelete(id);
};