// Input validation helpers (pure; no DB access).

export type Section =
  | "home"
  | "about"
  | "experience"
  | "education"
  | "project"
  | "contact"
  | "contact-info";

interface FieldRule {
  max: number;
  kind?: "url" | "email";
}

const SHORT = 200;
const LONG = 5000;

/** Editable fields per section (allowlist) with max lengths. */
export const FIELD_RULES: Record<Section, Record<string, FieldRule>> = {
  home: { heading: { max: SHORT }, summary: { max: LONG } },
  about: {
    aboutme: { max: LONG },
    noofprojects: { max: 20 },
    yearofexperience: { max: 20 },
    noofclients: { max: 20 },
    skills: { max: LONG },
    whyhirelabel: { max: SHORT },
    whyhireheading: { max: SHORT },
    whyhirehighlight: { max: SHORT },
  },
  experience: {
    position: { max: SHORT },
    company: { max: SHORT },
    duration: { max: SHORT },
    location: { max: SHORT },
    jobprofile: { max: SHORT },
  },
  education: {
    degree: { max: SHORT },
    year: { max: SHORT },
    college: { max: SHORT },
  },
  project: {
    name: { max: SHORT },
    website: { max: 500, kind: "url" },
    technologies: { max: 1000 },
    github: { max: 500, kind: "url" },
    image: { max: 1000, kind: "url" },
  },
  contact: {
    name: { max: 100 },
    email: { max: 254, kind: "email" },
    message: { max: LONG },
  },
  "contact-info": {
    label: { max: SHORT },
    heading: { max: SHORT },
    highlight: { max: SHORT },
    intro: { max: 1000 },
    email: { max: 254, kind: "email" },
    location: { max: SHORT },
  },
};

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidObjectIdString(value: unknown): value is string {
  return typeof value === "string" && OBJECT_ID_RE.test(value);
}

/** Only http(s) links are allowed; empty string means "no link". */
export function isSafeHttpUrl(value: string): boolean {
  if (value === "") return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isValidEmail(value: string): boolean {
  return value === "" || EMAIL_RE.test(value);
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export type ValidationResult =
  | { ok: true; data: Record<string, string> }
  | { ok: false; error: string };

/**
 * Picks only allowlisted fields, requires them to be strings within limits.
 * Unknown fields (e.g. _id, createdAt, order, $-operators) are dropped.
 */
export function validateFields(
  section: Section,
  body: unknown,
  required: string[] = []
): ValidationResult {
  if (!isPlainObject(body)) return { ok: false, error: "Invalid request body" };
  const rules = FIELD_RULES[section];
  const data: Record<string, string> = {};
  for (const [field, rule] of Object.entries(rules)) {
    const raw = body[field];
    if (raw === undefined || raw === null) continue;
    if (typeof raw !== "string") {
      return { ok: false, error: `Field "${field}" must be text` };
    }
    const value = raw.trim();
    if (value.length > rule.max) {
      return { ok: false, error: `Field "${field}" is too long (max ${rule.max} characters)` };
    }
    if (rule.kind === "url" && !isSafeHttpUrl(value)) {
      return { ok: false, error: `Field "${field}" must be a valid http(s) URL` };
    }
    if (rule.kind === "email" && !isValidEmail(value)) {
      return { ok: false, error: `Field "${field}" must be a valid email address` };
    }
    data[field] = value;
  }
  for (const field of required) {
    if (!data[field]) return { ok: false, error: `Field "${field}" is required` };
  }
  return { ok: true, data };
}

/** Reads a JSON body without throwing; returns undefined for invalid JSON. */
export async function readJson(req: Request, maxBytes = 100_000): Promise<unknown> {
  const length = Number(req.headers.get("content-length") || "0");
  if (length > maxBytes) return undefined;
  try {
    const text = await req.text();
    if (text.length > maxBytes) return undefined;
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
