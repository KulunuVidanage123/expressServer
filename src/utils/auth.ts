// src/utils/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    async (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      const existingUser = await UserModel.findById(user.id);
      if (!existingUser) {
        return res.status(403).json({ message: 'User not found' });
      }

      (req as AuthRequest).user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    }
  );
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};