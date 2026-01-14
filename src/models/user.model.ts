// src/models/user.model.ts
import mongoose, { Document, Schema, Model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username?: string;
  firstName?: string;     
  lastName?: string;         
  age?: number;            
  department?: string;
  email: string;
  password?: string; 
  gender?: string;
  phone?: string;
  dateOfBirth?: string;
  role: 'user' | 'admin' | 'manager'; 
  source: 'auth' | 'dashboard';
  createdAt: Date;
  updatedAt: Date;
  
  comparePassword(candidate: string): Promise<boolean>;
}

const validatePassword = function(this: IUser) {
  if (this.source === 'auth' && !this.password) {
    throw new Error('Password is required for authentication users');
  }
};

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: false, unique: true, sparse: true },
    firstName: { type: String, required: false }, 
    lastName: { type: String, required: false }, 
    age: { type: Number, required: false, min: 1 },
    department: { type: String, required: false },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'] 
    },
    password: { type: String, required: false, minlength: 6, select: false }, 
    gender: { type: String, required: false },
    phone: { type: String, required: false },
    dateOfBirth: { type: String, required: false },
    role: { 
      type: String, 
      required: true, 
      enum: ['user', 'admin', 'manager'], 
      default: 'user' 
    },
    source: {
      type: String,
      required: true,
      enum: ['auth', 'dashboard'],
      default: 'auth' // Default to auth users
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre('validate', validatePassword);

userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidate: string): Promise<boolean> {
  if (!this.password) return false; 
  return bcrypt.compare(candidate, this.password);
};

userSchema.index({ email: 1 });
userSchema.index({ username: 1 }, { sparse: true, unique: true });

const UserModel: Model<IUser> = models.User || mongoose.model<IUser>('User', userSchema);

export default UserModel;