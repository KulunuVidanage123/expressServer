// src/routes/auth.routes.ts
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/user.model';
import { getEnvVar } from '../config/env';
import { authenticateToken } from '../utils/auth';
import nodemailer from 'nodemailer'; 

const router = Router();

const JWT_SECRET = getEnvVar('JWT_SECRET');
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '604800', 10);

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, 
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const generateToken = (payload: { id: string; email: string; role: string }): string => {
  if (!payload.id || typeof payload.id !== 'string') {
    throw new Error('Invalid user ID for token generation');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const generateSecurePassword = (): string => {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); 
};

const sendPasswordEmail = async (email: string, password: string): Promise<void> => {
  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: 'Your Account Password - APITable',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Welcome to APITable!</h2>
        <p>Your account has been created successfully.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 3px;">${password}</code></p>
        </div>
        <p><strong>Important:</strong> Please log in and change your password immediately for security.</p>
        <p>Thank you for using our platform!</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #6c757d; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  });
};

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, role = 'user' } = req.body; 

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const validRoles = ['user']; 
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Public registration only allows "user" role' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const generatedPassword = generateSecurePassword();

    const user = new UserModel({
      email: normalizedEmail,
      password: generatedPassword, 
      role,
    });

    await user.save();

    await sendPasswordEmail(normalizedEmail, generatedPassword);

    res.status(201).json({
      message: 'User registered successfully! Check your email for your password.'
    });
  } catch (error: any) {
    console.error('🚨 Registration error:', error);
    
    if (error.message?.includes('Email')) {
      return res.status(500).json({ message: 'Registration successful but failed to send email. Contact support.' });
    }
    
    res.status(500).json({ message: 'Server error during registration' });
  }
});

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