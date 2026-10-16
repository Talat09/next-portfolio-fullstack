// Server-side admin authorization for route handlers and the proxy.
import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  getSessionSecret,
  verifySessionToken,
  type SessionPayload,
} from "./session";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function authNotConfiguredResponse(): NextResponse {
  console.error(
    "[auth] SESSION_SECRET is missing or shorter than 32 characters; admin access is disabled."
  );
  return NextResponse.json(
    {
      success: false,
      message: "Admin login is not configured on the server (SESSION_SECRET missing).",
    },
    { status: 500 }
  );
}

/** Same-origin check for state-changing requests (CSRF defence in depth). */
export function isCrossOrigin(req: NextRequest): boolean {
  if (SAFE_METHODS.has(req.method)) return false;
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== req.nextUrl.host;
  } catch {
    return true;
  }
}

export function getSession(req: NextRequest): SessionPayload | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value, secret);
}

/**
 * Returns an error response when the request is not from a logged-in admin,
 * or null when the request may continue. Call this BEFORE touching the DB.
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const secret = getSessionSecret();
  if (!secret) return authNotConfiguredResponse();
  if (isCrossOrigin(req)) {
    return NextResponse.json(
      { success: false, message: "Cross-origin request blocked" },
      { status: 403 }
    );
  }
  const session = verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value, secret);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please log in again." },
      { status: 401 }
    );
  }
  return null;
}

export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
