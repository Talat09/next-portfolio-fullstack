// Site-wide SEO constants and JSON-LD (schema.org) builders.
// Personal details come from the database or env, not from this file.
import type { About, ContactInfo, Education, Experience } from "@/types";
import { siteConfig } from "./site-config";

export const PERSON_NAME = "Talat Mahmud";
export const PERSON_ROLE = "Full Stack Software Engineer";
export const SITE_TITLE = `${PERSON_NAME} — ${PERSON_ROLE} (MERN, Next.js, React)`;
export const SITE_DESCRIPTION =
  `${PERSON_NAME} is a ${PERSON_ROLE} in Dhaka, Bangladesh, specialising in the MERN stack, ` +
  "Next.js, React, TypeScript, AI integration and SaaS development. " +
  "See projects, experience and how to get in touch.";

export function sameAsLinks(): string[] {
  return Object.values(siteConfig.social).filter((s): s is string => Boolean(s));
}

function isRealEmail(email?: string): boolean {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && !/example\.(com|org|net)$/.test(e);
}

function splitList(value?: string): string[] {
  return (value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Current job = entry whose duration mentions "Present", otherwise the last one. */
function currentJob(experience: Experience[] | undefined): Experience | undefined {
  if (!experience?.length) return undefined;
  return (
    experience.find((e) => /present|current|now/i.test(e.duration || "")) ||
    experience[experience.length - 1]
  );
}

interface JsonLdInput {
  about?: About | null;
  experience?: Experience[];
  education?: Education[];
  contactInfo?: ContactInfo | null;
  imagePath?: string;
}

export function buildJsonLd({ about, experience, education, contactInfo, imagePath }: JsonLdInput) {
  // No trailing slash, matching the canonical URL and the sitemap.
  const url = siteConfig.siteUrl;
  const personId = `${url}#person`;
  const websiteId = `${url}#website`;
  const job = currentJob(experience);
  const email = contactInfo?.email || siteConfig.contactEmail;
  const colleges = Array.from(
    new Set((education || []).map((e) => (e.college || "").trim()).filter(Boolean))
  );

  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": personId,
    name: PERSON_NAME,
    givenName: "Talat",
    familyName: "Mahmud",
    // Same role everywhere (title, OG, h1); not taken from the experience entries.
    jobTitle: PERSON_ROLE,
    description: SITE_DESCRIPTION,
    url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    nationality: { "@type": "Country", name: "Bangladesh" },
  };
  if (siteConfig.personAltNames.length) person.alternateName = siteConfig.personAltNames;
  if (imagePath) person.image = new URL(imagePath, siteConfig.siteUrl).toString();
  if (isRealEmail(email)) person.email = `mailto:${email.trim()}`;
  if (job?.company?.trim()) person.worksFor = { "@type": "Organization", name: job.company.trim() };
  if (colleges.length) {
    person.alumniOf = colleges.map((name) => ({ "@type": "EducationalOrganization", name }));
  }
  const skills = splitList(about?.skills);
  if (skills.length) person.knowsAbout = skills;
  const sameAs = sameAsLinks();
  if (sameAs.length) person.sameAs = sameAs;

  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": websiteId,
        url,
        name: `${PERSON_NAME} Portfolio`,
        alternateName: PERSON_NAME,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}#profilepage`,
        url,
        name: SITE_TITLE,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        about: { "@id": personId },
      },
    ],
  };
}

/** JSON for a <script type="application/ld+json">, safe against "</script>" injection. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
