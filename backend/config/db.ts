import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected");
  } catch (error) {
    console.log("MongoDB connection error", error);
    throw error;
  }
};

export default connectDB;
