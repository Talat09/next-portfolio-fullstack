import mongoose, { Model, Schema } from "mongoose";
import type { EducationData } from "@/types";

const EducationSchema = new Schema<EducationData>(
  {
    degree: String,
    year: String,
    college: String,
  },
  { timestamps: true }
);

const Education: Model<EducationData> =
  (mongoose.models.Education as Model<EducationData> | undefined) ||
  mongoose.model<EducationData>("Education", EducationSchema);

export default Education;
