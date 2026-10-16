import mongoose, { Model, Schema } from "mongoose";
import type { HomeData } from "@/types";

const HomeSchema = new Schema<HomeData>(
  {
    heading: String,
    summary: String,
  },
  { timestamps: true }
);

const Home: Model<HomeData> =
  (mongoose.models.Home as Model<HomeData> | undefined) ||
  mongoose.model<HomeData>("Home", HomeSchema);

export default Home;
