// src/routes/product.routes.ts
import { Router } from 'express';
import { Product as ProductModel } from '../models/product.model';

const router = Router();

/**
 * @route   GET /api/product
 * @desc    Get all products
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

/**
 * @route   GET /api/product/:id
 * @desc    Get a single product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

/**
 * @route   POST /api/product
 * @desc    Create a new product
 * @access  Public
 */
router.post('/', async (req, res) => {
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

    // Basic validation
    if (!title || !brand || !price || !category || stock === undefined || rating === undefined || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
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
    res.status(201).json({
      success: true,
      data: savedProduct
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map((err: any) => err.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

/**
 * @route   PUT /api/product/:id
 * @desc    Update a product by ID
 * @access  Public
 */
router.put('/:id', async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map((err: any) => err.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

/**
 * @route   DELETE /api/product/:id
 * @desc    Delete a product by ID
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

export default router;