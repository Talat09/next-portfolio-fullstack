import mongoose, { Model, Schema } from "mongoose";
import type { ProjectData } from "@/types";

const ProjectSchema = new Schema<ProjectData>(
  {
    name: String,
    website: String,
    technologies: String,
    github: String,
  },
  { timestamps: true }
);

const Project: Model<ProjectData> =
  (mongoose.models.Project as Model<ProjectData> | undefined) ||
  mongoose.model<ProjectData>("Project", ProjectSchema);

export default Project;
