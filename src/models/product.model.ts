// src/models/product.model.ts
import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  brand: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
  description?: string;
  imageUrl: string;
}

const productSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  description: { type: String },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

export const Product = model<IProduct>('Product', productSchema);