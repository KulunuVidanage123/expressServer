// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../services/product.service';

const sendSuccess = (res: Response, data: any, statusCode: number = 200) => {
  res.status(statusCode).json(data);
};

const sendError = (res: Response, message: string, statusCode: number = 400) => {
  res.status(statusCode).json({ message });
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const product = await createProduct(req.body);
    sendSuccess(res, product, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create product', 400);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts(req.query);
    sendSuccess(res, products);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch products', 500);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }
    sendSuccess(res, product);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch product', 500);
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }
    sendSuccess(res, product);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update product', 400);
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const product = await deleteProduct(req.params.id);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }
    sendSuccess(res, { message: 'Product deleted successfully' });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete product', 500);
  }
};