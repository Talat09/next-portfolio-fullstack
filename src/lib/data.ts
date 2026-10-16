// Server-side data layer for the public sections. Used by the public
// GET API routes and by the homepage, so the page reads the database
// directly instead of calling its own API over HTTP.
import "server-only";
import type { Model } from "mongoose";
import connectToDB from "@/database";
import About from "@/models/About";
import ContactInfo from "@/models/ContactInfo";
import Education from "@/models/Education";
import Experience from "@/models/Experience";
import Home from "@/models/Home";
import Project from "@/models/Project";

export type PublicSection =
  | "home"
  | "about"
  | "experience"
  | "education"
  | "project"
  | "contact-info";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const models: Record<PublicSection, Model<any>> = {
  home: Home,
  about: About,
  experience: Experience,
  education: Education,
  project: Project,
  "contact-info": ContactInfo,
};

/**
 * Returns all documents of a public section as plain JSON objects
 * (same shape the API returns), or null if the database is unavailable.
 */
export async function getSectionData<T = unknown>(
  section: PublicSection
): Promise<T[] | null> {
  try {
    await connectToDB();
    const docs = await models[section].find({}).lean();
    return JSON.parse(JSON.stringify(docs)) as T[];
  } catch (e) {
    console.error(`[data/${section}]`, e instanceof Error ? e.message : e);
    return null;
  }
}