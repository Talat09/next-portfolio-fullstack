import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getSectionData } from "@/lib/data";
import { sortByOrderThenUpdated } from "@/lib/sort";
import { buildProjectSlugs, projectPath } from "@/lib/project";
import type { Project } from "@/types";

export const revalidate = 3600;

// Homepage plus one page per project.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = sortByOrderThenUpdated((await getSectionData<Project>("project")) ?? []);
  const slugs = buildProjectSlugs(projects);
  return [
    {
      url: siteConfig.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((p) => ({
      url: `${siteConfig.siteUrl}${projectPath(slugs.get(p._id || p.name) || "")}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}