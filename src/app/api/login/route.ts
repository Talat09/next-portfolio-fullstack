// Admin login: rate limited, validated, bcrypt-verified; sets a signed HttpOnly session cookie.
import connectToDB from "@/database";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { authNotConfiguredResponse, isCrossOrigin, setSessionCookie } from "@/lib/auth";
import { createSessionToken, getSessionSecret } from "@/lib/session";
import { fakePasswordCheck, verifyPassword } from "@/lib/password";
import { getClientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { isPlainObject, readJson } from "@/lib/validate";

export const dynamic = "force-dynamic";

const LIMIT = 5; // attempts
const WINDOW_MS = 15 * 60 * 1000; // per 15 minutes per IP
const INVALID = "Invalid username or password";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const key = `login:${getClientIp(req)}`;
  const limited = rateLimit(key, LIMIT, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { success: false, message: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }
  const secret = getSessionSecret();
  if (!secret) return authNotConfiguredResponse();
  if (isCrossOrigin(req)) {
    return NextResponse.json(
      { success: false, message: "Cross-origin request blocked" },
      { status: 403 }
    );
  }

  const body = await readJson(req, 10_000);
  const username = isPlainObject(body) ? body.username : undefined;
  const password = isPlainObject(body) ? body.password : undefined;
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password ||
    username.length > 200 ||
    password.length > 200
  ) {
    return NextResponse.json({ success: false, message: INVALID }, { status: 400 });
  }

  try {
    await connectToDB();
    const user = await User.findOne({ username: username.trim() });
    const ok = user
      ? await verifyPassword(password, user.password)
      : await fakePasswordCheck(password);
    if (!user || !ok) {
      return NextResponse.json({ success: false, message: INVALID }, { status: 401 });
    }
    resetRateLimit(key);
    const res = NextResponse.json({ success: true, message: "Login successful" });
    setSessionCookie(res, createSessionToken(String(user._id), secret));
    return res;
  } catch (e) {
    console.error("[api/login]", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { success: false, message: "Something goes wrong !Please try again" },
      { status: 500 }
    );
  }
}
