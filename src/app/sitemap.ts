import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Single-page portfolio: the homepage is the only indexable URL.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
