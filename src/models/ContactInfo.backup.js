import mongoose from "mongoose";

// Single document holding the public "Contact" section content
const ContactInfoSchema = new mongoose.Schema(
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

const ContactInfo =
  mongoose.models.ContactInfo ||
  mongoose.model("ContactInfo", ContactInfoSchema);

export default ContactInfo;
