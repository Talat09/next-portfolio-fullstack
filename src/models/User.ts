import mongoose, { Model, Schema } from "mongoose";
import type { UserData } from "@/types";

const UserSchema = new Schema<UserData>(
  {
    username: String,
    password: String,
  },
  { timestamps: true }
);

const User: Model<UserData> =
  (mongoose.models.User as Model<UserData> | undefined) ||
  mongoose.model<UserData>("User", UserSchema);

export default User;
