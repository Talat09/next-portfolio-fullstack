// Server-side data layer for the public sections. Used by the public
// GET API routes and by the homepage, so the page reads the database
// directly instead of calling its own API over HTTP.
import "server-only";
import mongoose, { type Model } from "mongoose";
import { unstable_cache } from "next/cache";
import { PORTFOLIO_TAG } from "./revalidate";
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

// Keep the page payload small: no __v anywhere; timestamps only where used
// (project cards show createdAt and sort by updatedAt).
const SECTION_PROJECTION: Record<PublicSection, string> = {
  home: "-__v -createdAt -updatedAt",
  about: "-__v -createdAt -updatedAt",
  experience: "-__v -createdAt -updatedAt",
  education: "-__v -createdAt -updatedAt",
  project: "-__v",
  "contact-info": "-__v -createdAt -updatedAt",
};

/** One hour; admin writes purge the "portfolio" tag immediately (see revalidate.ts). */
const SECTION_CACHE_SECONDS = 3600;

// Throws instead of returning null so a failed read is never stored in the cache.
const loadSection = unstable_cache(
  async (section: PublicSection): Promise<unknown[]> => {
    await connectToDB();
    // connectToDB logs and swallows errors; don't let queries sit in Mongoose's buffer.
    if (mongoose.connection.readyState !== 1) throw new Error("database unavailable");
    const docs = await models[section]
      .find({}, SECTION_PROJECTION[section])
      .maxTimeMS(4_000)
      .lean();
    return JSON.parse(JSON.stringify(docs)) as unknown[];
  },
  ["portfolio-section"],
  { tags: [PORTFOLIO_TAG], revalidate: SECTION_CACHE_SECONDS }
);

/**
 * Returns all documents of a public section as plain JSON objects
 * (same shape the API returns), or null if the database is unavailable.
 */
export async function getSectionData<T = unknown>(
  section: PublicSection
): Promise<T[] | null> {
  try {
    return (await loadSection(section)) as T[];
  } catch (e) {
    console.error(`[data/${section}]`, e instanceof Error ? e.message : e);
    return null;
  }
}