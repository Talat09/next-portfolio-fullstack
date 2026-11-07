// llms.txt (https://llmstxt.org): a plain-text site summary for AI agents and crawlers.
import { siteConfig } from "@/lib/site-config";
import { getSectionData } from "@/lib/data";
import { sortByOrderThenUpdated } from "@/lib/sort";
import { buildProjectSlugs, projectPath } from "@/lib/project";
import { PERSON_NAME, PERSON_ROLE, SITE_DESCRIPTION, sameAsLinks } from "@/lib/seo";
import type { About, Experience, Project } from "@/types";

export const revalidate = 3600;

function oneLine(value?: string): string {
  return (value || "").replace(/\s+/g, " ").trim();
}

export async function GET() {
  const url = siteConfig.siteUrl;
  const [aboutDocs, experience, projectDocs] = await Promise.all([
    getSectionData<About>("about"),
    getSectionData<Experience>("experience"),
    getSectionData<Project>("project"),
  ]);
  const about = aboutDocs?.[0];
  const projects = sortByOrderThenUpdated(projectDocs ?? []);
  const slugs = buildProjectSlugs(projects);

  const lines: string[] = [
    `# ${PERSON_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${PERSON_NAME} (also known as ${siteConfig.personAltNames.join(", ")}) is a ${PERSON_ROLE} based in Dhaka, Bangladesh.`,
  ];

  const aboutMe = oneLine(about?.aboutme);
  if (aboutMe) lines.push("", aboutMe);

  const skills = oneLine(about?.skills);
  if (skills) lines.push("", `Skills: ${skills}`);

  lines.push(
    "",
    "## Main pages",
    `- [Portfolio home](${url}): About, skills, experience, education, projects and contact`
  );
  if (siteConfig.cvUrl) {
    lines.push(`- [CV / Resume](${new URL(siteConfig.cvUrl, url).toString()}): Downloadable PDF`);
  }

  if (projects.length) {
    lines.push("", "## Projects");
    for (const p of projects) {
      const link = `${url}${projectPath(slugs.get(p._id || p.name) || "")}`;
      const summary = oneLine(p.tagline) || oneLine(p.technologies);
      lines.push(`- [${p.name}](${link})${summary ? `: ${summary}` : ""}`);
    }
  }

  if (experience?.length) {
    lines.push("", "## Experience");
    for (const e of experience) {
      const parts = [oneLine(e.position), oneLine(e.company), oneLine(e.duration)].filter(Boolean);
      if (parts.length) lines.push(`- ${parts.join(", ")}`);
    }
  }

  const profiles = sameAsLinks();
  if (profiles.length) {
    lines.push("", "## Profiles");
    for (const link of profiles) lines.push(`- ${link}`);
  }

  lines.push("", "## Optional", `- [Sitemap](${url}/sitemap.xml)`, "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
