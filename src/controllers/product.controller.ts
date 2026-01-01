import { Request, Response } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../services/product.service';
import { SUCCESS, ERROR } from '../utils/helper';

export const addProduct = async (req: Request, res: Response) => {
  try {
    const product = await createProduct(req.body);
    SUCCESS(res, { code: 201, message: 'Product created successfully' }, product);
  } catch (error: any) {
    ERROR(res, { statusCode: 400, message: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await getAllProducts(req.query);
    SUCCESS(res, { code: 200, message: 'Products fetched successfully' }, result);
  } catch (error: any) {
    ERROR(res, { statusCode: 500, message: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return ERROR(res, { statusCode: 404, message: 'Product not found' });
    }
    SUCCESS(res, { code: 200, message: 'Product fetched successfully' }, product);
  } catch (error: any) {
    ERROR(res, { statusCode: 500, message: error.message });
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    if (!product) {
      return ERROR(res, { statusCode: 404, message: 'Product not found' });
    }
    SUCCESS(res, { code: 200, message: 'Product updated successfully' }, product);
  } catch (error: any) {
    ERROR(res, { statusCode: 500, message: error.message });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const product = await deleteProduct(req.params.id);
    if (!product) {
      return ERROR(res, { statusCode: 404, message: 'Product not found' });
    }
    SUCCESS(res, { code: 200, message: 'Product deleted successfully' }, product);
  } catch (error: any) {
    ERROR(res, { statusCode: 500, message: error.message });
  }
};