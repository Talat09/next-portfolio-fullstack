// Signed admin session tokens (HMAC-SHA256). Pure Node crypto, no DB access.
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "admin_session";
/** Session lifetime in seconds (8 hours) */
export const SESSION_MAX_AGE = 60 * 60 * 8;

export interface SessionPayload {
  sub: string;
  iat: number;
  exp: number;
}

/** Returns the signing secret, or null when it is missing/too short (fail closed). */
export function getSessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  return typeof secret === "string" && secret.length >= 32 ? secret : null;
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken(
  sub: string,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000)
): string {
  const payload: SessionPayload = {
    sub,
    iat: nowSeconds,
    exp: nowSeconds + SESSION_MAX_AGE,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function verifySessionToken(
  token: string | undefined | null,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000)
): SessionPayload | null {
  if (typeof token !== "string" || token.length > 2048) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const [body, signature] = parts;
  const expected = Buffer.from(sign(body, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as Partial<SessionPayload>;
    if (
      typeof payload.sub !== "string" ||
      typeof payload.exp !== "number" ||
      typeof payload.iat !== "number" ||
      payload.exp <= nowSeconds
    ) {
      return null;
    }
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
