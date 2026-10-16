import mongoose, { Model, Schema } from "mongoose";
import type { ProjectData } from "@/types";

const ProjectSchema = new Schema<ProjectData>(
  {
    name: String,
    website: String,
    technologies: String,
    github: String,
    image: String,
    order: Number,
  },
  { timestamps: true }
);

const Project: Model<ProjectData> =
  (mongoose.models.Project as Model<ProjectData> | undefined) ||
  mongoose.model<ProjectData>("Project", ProjectSchema);

export default Project;
