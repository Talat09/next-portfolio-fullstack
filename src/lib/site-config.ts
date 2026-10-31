// Public site configuration, read from environment variables (see .env.example).
// NEXT_PUBLIC_* values are inlined at build time, so they must be referenced
// literally (process.env.NEXT_PUBLIC_X) for Next.js to substitute them.

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

// Share/tracking params added by social apps; real ones (e.g. Facebook ?id=) are kept.
const TRACKING_PARAM = /^(utm_\w+|igsh|igshid|fbclid|gclid|mibextid|si|ref|ref_src|rdid|share_url|_rdr)$/i;

/** Profile URL without tracking query params or hash (e.g. Instagram ?igsh=...). */
function cleanProfileUrl(value: string | undefined): string {
  const raw = clean(value);
  if (!raw) return "";
  try {
    const u = new URL(raw);
    for (const key of [...u.searchParams.keys()]) {
      if (TRACKING_PARAM.test(key)) u.searchParams.delete(key);
    }
    u.hash = "";
    return u.toString();
  } catch {
    return raw;
  }
}

function siteUrl(): string {
  const explicit = clean(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = clean(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  siteUrl: siteUrl(),
  /** Absolute URL or /public path of the CV; the button is hidden when empty. */
  cvUrl: clean(process.env.NEXT_PUBLIC_CV_URL),
  /** Image used for Open Graph / social previews (absolute URL). */
  ogImageUrl: clean(process.env.NEXT_PUBLIC_OG_IMAGE_URL),
  /** Fallbacks shown when the Contact Info document has no email/location. */
  contactEmail: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  contactLocation: clean(process.env.NEXT_PUBLIC_CONTACT_LOCATION),
  /** Google Search Console HTML-tag verification token (optional). */
  googleSiteVerification: clean(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
  /** Other names people may search for, comma-separated (optional). */
  personAltNames: [
    ...new Set([
      "Dihan",
      "Talat Mahmud Dihan",
      ...clean(process.env.NEXT_PUBLIC_PERSON_ALT_NAMES)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ]),
  ],
  social: {
    facebook: cleanProfileUrl(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK),
    github: cleanProfileUrl(process.env.NEXT_PUBLIC_SOCIAL_GITHUB),
    linkedin: cleanProfileUrl(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN),
    instagram: cleanProfileUrl(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM),
  },
} as const;

export type SocialId = keyof typeof siteConfig.social;