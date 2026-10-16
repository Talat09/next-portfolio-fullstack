// Next.js 16 proxy (formerly middleware): defence in depth for the API.
// Route handlers also call requireAdmin(); this blocks unauthenticated writes early.
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";

/** Write endpoints that must stay public */
const PUBLIC_WRITES = new Set(["/api/login", "/api/contact/add", "/api/auth/logout"]);
/** Read endpoints that are private */
const PRIVATE_READS = new Set(["/api/contact/get"]);
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname.replace(/\/+$/, "") || "/";
  const isWrite = !SAFE_METHODS.has(req.method);
  const needsAdmin = isWrite ? !PUBLIC_WRITES.has(path) : PRIVATE_READS.has(path);
  if (needsAdmin) {
    const denied = requireAdmin(req);
    if (denied) return denied;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
