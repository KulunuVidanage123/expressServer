// src/routes/upload.routes.ts
import { Router } from 'express';
import multer from 'multer';
import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, 
});

router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    console.log('📸 Upload request received');
    console.log('📁 File received:', !!req.file);
    if (req.file) {
      console.log('📄 File info:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const key = `user-images/${timestamp}-${randomString}${fileExtension}`;

    console.log('📤 Uploading to S3 with key:', key);

    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const uploadResult = await s3.upload(params).promise();

    console.log('✅ Upload success:', uploadResult.Location);
    res.json({ imageUrl: uploadResult.Location });

  } catch (error: any) {
    console.error('❌ S3 UPLOAD FAILED:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Code:', error.code);
    console.error('Bucket:', process.env.S3_BUCKET_NAME);
    console.error('Region:', process.env.AWS_REGION);

    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;