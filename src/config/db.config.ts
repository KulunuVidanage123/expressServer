import mongoose from 'mongoose';
import { APPLICATION } from './app.config';

export const connectDb = () => {
  mongoose
    .connect(APPLICATION.MONGO_URI as string)
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1); 
    });
};