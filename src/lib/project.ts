// Shared project helpers (safe on server and client).
import type { Project } from "@/types";

/** "Project OTA-Portfolio" -> "project-ota" */
export function slugify(value: string | undefined): string {
  return (value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-?portfolio$/, "")
    .replace(/-+$/g, "")
    .slice(0, 80);
}

/** Admin-set slug if present, otherwise derived from the name. */
export function getProjectSlug(project: Pick<Project, "name" | "slug">): string {
  return slugify(project.slug) || slugify(project.name) || "project";
}

/**
 * Unique slug per project id. When two projects share a slug, every one after
 * the first (in list order) gets a short id suffix.
 */
export function buildProjectSlugs(projects: Project[]): Map<string, string> {
  const map = new Map<string, string>();
  const used = new Set<string>();
  for (const p of projects) {
    const key = p._id || p.name;
    let slug = getProjectSlug(p);
    if (used.has(slug)) slug = `${slug}-${(p._id || "").slice(-6) || used.size}`;
    used.add(slug);
    map.set(key, slug);
  }
  return map;
}

export function projectPath(slug: string): string {
  return `/projects/${slug}`;
}

/** Cloudinary images go through next/image optimisation; other hosts are shown as-is. */
export function isCloudinary(url: string): boolean {
  try {
    return new URL(url).hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

export function splitTech(value?: string): string[] {
  return (value || "").split(",").map((t) => t.trim()).filter(Boolean);
}

export function splitFeatures(value?: string): string[] {
  return (value || "")
    .split("\n")
    .map((l) => l.replace(/^[-*\u2022]\s*/, "").trim())
    .filter(Boolean);
}

/** Plain-text summary for meta descriptions (~155 chars, cut at a word). */
export function summarize(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length).replace(/[,.;:\s]+$/, "")}\u2026`;
}