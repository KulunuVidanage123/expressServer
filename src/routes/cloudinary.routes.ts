// src/routes/cloudinary.routes.ts
import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary'; 

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define the expected shape of Cloudinary's upload response
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: any; // allow other fields
}

// Upload image to Cloudinary
router.post('/upload-cloudinary', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as CloudinaryUploadResult);
          }
        }
      );

      // Pipe buffer to Cloudinary stream
      const bufferStream = require('stream').Readable.from(req.file.buffer);
      bufferStream.pipe(uploadStream);
    });

    res.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image to Cloudinary',
      error: error.message,
    });
  }
});

export default router;