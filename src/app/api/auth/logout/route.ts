// Clears the admin session cookie.
import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(): Promise<NextResponse> {
  const res = NextResponse.json({ success: true, message: "Logged out successfully" });
  clearSessionCookie(res);
  return res;
}
