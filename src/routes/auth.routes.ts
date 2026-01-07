// src/routes/auth.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/user.model';
import { getEnvVar } from '../config/env';
import { authenticateToken } from '../utils/auth'; 

const router = Router();

const JWT_SECRET = getEnvVar('JWT_SECRET');
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '604800', 10); 

/**
 * Generates a JWT token with strict payload validation
 */
const generateToken = (payload: { id: string; email: string; role: string }): string => {
  if (!payload.id || typeof payload.id !== 'string') {
    throw new Error('Invalid user ID for token generation');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (minimal auth-only fields)
 * @access  Public
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role = 'user' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const validRoles = ['user', 'admin', 'manager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be one of: user, admin, manager' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const user = new UserModel({
      email: normalizedEmail,
      password, 
      role,
    });

    await user.save();

    const userId = user._id.toString();

    const token = generateToken({
      id: userId,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('🚨 Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const userId = user._id.toString();

    const token = generateToken({
      id: userId,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('🚨 Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Validate JWT and return current user
 * @access  Private (requires valid JWT)
 */
router.get('/me', authenticateToken, async (req: any, res: Response) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error: any) {
    console.error('🚨 Auth /me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;