import { IProduct } from '../models/product.model';
import { Product as ProductModel } from '../models/product.model';

export const createProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
  const newProduct = new ProductModel(productData);
  return await newProduct.save();
};

export const getAllProducts = async (query?: { page?: number, limit?: number, search?: string }): Promise<{ products: IProduct[], total: number, totalPages: number, currentPage: number }> => {
  const { page = 1, limit = 10, search = "" } = query || {};
  const skip = (Number(page) - 1) * Number(limit);
  const searchQuery: any = {};

  if (search) {
    searchQuery.name = { $regex: search, $options: 'i' }; 
  }

  const products = await ProductModel.find(searchQuery).skip(skip).limit(Number(limit));
  const total = await ProductModel.countDocuments(searchQuery);

  return {
    products,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page)
  };
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return await ProductModel.findById(id);
};

export const updateProduct = async (id: string, updateData: Partial<IProduct>): Promise<IProduct | null> => {
  return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return await ProductModel.findByIdAndDelete(id);
};