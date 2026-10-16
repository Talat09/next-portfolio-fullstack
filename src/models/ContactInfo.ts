import mongoose, { Model, Schema } from "mongoose";
import type { ContactInfoData } from "@/types";

const ContactInfoSchema = new Schema<ContactInfoData>(
  {
    label: String,
    heading: String,
    highlight: String,
    intro: String,
    email: String,
    location: String,
  },
  { timestamps: true }
);

const ContactInfo: Model<ContactInfoData> =
  (mongoose.models.ContactInfo as Model<ContactInfoData> | undefined) ||
  mongoose.model<ContactInfoData>("ContactInfo", ContactInfoSchema);

export default ContactInfo;
