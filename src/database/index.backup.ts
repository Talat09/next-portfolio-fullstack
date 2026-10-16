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
    // useNewUrlParser / useUnifiedTopology were removed from the typed
    // options in mongoose 6+ (they are no-ops); passed through for parity.
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log("Database connected successfully");
  } catch (e) {
    console.error(
      "Error connecting to the database:",
      e instanceof Error ? e.message : e
    );
  }
}
