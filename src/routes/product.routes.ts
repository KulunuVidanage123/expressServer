// src/routes/product.routes.ts
import { Router } from 'express';
import { Product as ProductModel } from '../models/product.model';
import { authenticateToken } from '../utils/auth';
import { authorizeRoles } from '../middleware/authorizeRoles'; 

const router = Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) { 
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

router.post('/', 
  authenticateToken, 
  authorizeRoles('admin'), 
  async (req, res) => {
    try {
      const {
        title,
        brand,
        price,
        category,
        stock,
        rating,
        description,
        imageUrl
      } = req.body;

      if (!title || !brand || price == null || !category || stock == null || rating == null || !imageUrl) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const product = new ProductModel({
        title,
        brand,
        price: parseFloat(price as string),
        category,
        stock: parseInt(stock as string, 10),
        rating: parseFloat(rating as string),
        description: description || '',
        imageUrl
      });

      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error: any) {
      console.error('Error creating product:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation failed' });
      }
      res.status(500).json({ message: 'Failed to create product' });
    }
  }
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  async (req, res) => {
    try {
      const {
        title,
        brand,
        price,
        category,
        stock,
        rating,
        description,
        imageUrl
      } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (brand !== undefined) updateData.brand = brand;
      if (price !== undefined) updateData.price = parseFloat(price as string);
      if (category !== undefined) updateData.category = category;
      if (stock !== undefined) updateData.stock = parseInt(stock as string, 10);
      if (rating !== undefined) updateData.rating = parseFloat(rating as string);
      if (description !== undefined) updateData.description = description;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

      const product = await ProductModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(product);
    } catch (error: any) {
      console.error('Error updating product:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation failed' });
      }
      res.status(500).json({ message: 'Failed to update product' });
    }
  }
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  async (req, res) => {
    try {
      const product = await ProductModel.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Failed to delete product' });
    }
  }
);

export default router;