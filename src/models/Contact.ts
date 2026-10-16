import mongoose, { Model, Schema } from "mongoose";
import type { ContactData } from "@/types";

const ContactSchema = new Schema<ContactData>(
  {
    name: String,
    email: String,
    message: String,
  },
  { timestamps: true }
);

const Contact: Model<ContactData> =
  (mongoose.models.Contacts as Model<ContactData> | undefined) ||
  mongoose.model<ContactData>("Contacts", ContactSchema);

export default Contact;
