// src/services/user.service.ts
import { IUser } from '../models/user.model';
import { UserModel } from '../models/user.model';

// Allowed fields for updates (match your frontend form)
const ALLOWED_UPDATE_FIELDS = [
  'firstName',
  'lastName',
  'age',
  'gender',
  'email',
  'phone',
  'dateOfBirth',
  'role',
  'department', // optional if kept in model
  'username'    // optional if kept in model
];

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const existingUser = await UserModel.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User already registered');
  }

  // // Uncomment when implementing auth
  // if (userData.password) {
  //   const hashedPassword = await bcrypt.hash(userData.password, 10);
  //   userData.password = hashedPassword;
  // }

  const newUser = new UserModel(userData);
  return await newUser.save();
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await UserModel.find().select('-password');
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return await UserModel.findById(id).select('-password');
};

export const updateUser = async (
  id: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  // Filter out disallowed fields (e.g., _id, password)
  const filteredUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([key]) =>
      ALLOWED_UPDATE_FIELDS.includes(key)
    )
  );

  if (Object.keys(filteredUpdateData).length === 0) {
    throw new Error('No valid fields to update');
  }

  // Use $set to update only provided fields
  // runValidators: true validates ONLY the fields being updated
  return await UserModel.findByIdAndUpdate(
    id,
    { $set: filteredUpdateData },
    { 
      new: true, 
      runValidators: true,
      context: 'query' // Ensures validators run with full doc context
    }
  ).select('-password');
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  return await UserModel.findByIdAndDelete(id);
};