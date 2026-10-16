import mongoose, { Model, Schema } from "mongoose";
import type { AboutData } from "@/types";

const AboutSchema = new Schema<AboutData>(
  {
    aboutme: String,
    noofprojects: String,
    yearofexperience: String,
    noofclients: String,
    skills: String,
    whyhirelabel: String,
    whyhireheading: String,
    whyhirehighlight: String,
  },
  { timestamps: true }
);

const About: Model<AboutData> =
  (mongoose.models.About as Model<AboutData> | undefined) ||
  mongoose.model<AboutData>("About", AboutSchema);

export default About;
