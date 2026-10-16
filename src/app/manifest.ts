import type { MetadataRoute } from "next";
import { PERSON_NAME, PERSON_ROLE } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PERSON_NAME} — ${PERSON_ROLE}`,
    short_name: PERSON_NAME,
    description: `Portfolio of ${PERSON_NAME}, ${PERSON_ROLE}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a9e55",
    icons: [
      { src: "/icon.png", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
