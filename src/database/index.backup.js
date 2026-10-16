import mongoose from "mongoose";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const uri = process.env.NEXT_PUBLIC_API_URL;
// console.log(uri);
export default async function connectToDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (e) {
    console.error("Error connecting to the database:", e.message);
  }
}
