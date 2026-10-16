import mongoose from "mongoose";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const uri = process.env.NEXT_PUBLIC_API_URL;
// console.log(uri);
export default async function connectToDB(): Promise<void> {
  try {
    if (!uri) {
      throw new Error("NEXT_PUBLIC_API_URL is not set");
    }
    await mongoose.connect(uri);
    console.log("Database connected successfully");
  } catch (e) {
    console.error(
      "Error connecting to the database:",
      e instanceof Error ? e.message : e
    );
  }
}
