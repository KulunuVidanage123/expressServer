import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  department: string;
  email: string;
  password: string; // This will be hashed before saving
  gender?: string;
  phone?: string;
  dateOfBirth?: string;
  role?: string; // For Role-Based Authentication (RBA)
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: false, unique: true, sparse: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: false },
  department: { type: String, required: false },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: false },
  phone: { type: String, required: false },
  dateOfBirth: { type: String, required: false },
  role: { type: String, required: false },
}, {
  timestamps: true
});

export const UserModel = mongoose.model<IUser>('User', userSchema);