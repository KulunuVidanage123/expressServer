// server.ts
import dotenv from 'dotenv';
dotenv.config(); // 🟢 Must be first

// 🔍 Optional: Log config for debugging
console.log('🔍 Environment Check:');
console.log('  MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
console.log('  AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing');
console.log('  AWS_REGION:', process.env.AWS_REGION || '⚠️ Not set');
console.log('  S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME || '⚠️ Not set');

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

// Routes
import userRoutes from './src/routes/user.routes';
import productRoutes from './src/routes/product.routes';
import cloudinaryRoutes from './src/routes/cloudinary.routes';
import uploadRoutes from './src/routes/upload.routes';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// 🟢 CORS middleware — handles preflight (OPTIONS) automatically
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

app.use(
  cors({
    origin: [
      FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173', // Vite default
    ],
    credentials: true,
  })
);

// 🟢 Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🟢 Static files (optional)
app.use(express.static(path.join(__dirname, 'public')));

// 🟢 Routes
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product', productRoutes);
app.use('/api', cloudinaryRoutes);
app.use('/api', uploadRoutes); // → POST /api/upload-image

// 🟢 Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// 🟢 Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 🟢 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// 🟢 MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// 🟢 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📘 Health check: http://localhost:${PORT}/health`);
});