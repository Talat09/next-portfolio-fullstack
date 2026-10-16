// Tells the admin page whether the current browser has a valid session.
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSessionSecret } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const configured = Boolean(getSessionSecret());
  const session = configured ? getSession(req) : null;
  return NextResponse.json(
    { success: true, authenticated: Boolean(session), configured },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
