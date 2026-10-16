import mongoose, { Model, Schema } from "mongoose";
import type { ExperienceData } from "@/types";

const ExperienceSchema = new Schema<ExperienceData>(
  {
    position: String,
    company: String,
    duration: String,
    location: String,
    jobprofile: String,
  },
  { timestamps: true }
);

const Experience: Model<ExperienceData> =
  (mongoose.models.Experience as Model<ExperienceData> | undefined) ||
  mongoose.model<ExperienceData>("Experience", ExperienceSchema);

export default Experience;
