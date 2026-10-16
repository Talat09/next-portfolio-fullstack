// Public contact form endpoint: rate limited, honeypot-protected and validated.
import connectToDB from "@/database";
import Contact from "@/models/Contact";
import { NextRequest, NextResponse } from "next/server";
import { isPlainObject, readJson, validateFields } from "@/lib/validate";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const LIMIT = 5; // messages
const WINDOW_MS = 10 * 60 * 1000; // per 10 minutes per IP

export async function POST(req: NextRequest): Promise<NextResponse> {
  const limited = rateLimit(`contact:${getClientIp(req)}`, LIMIT, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { success: false, message: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }
  const body = await readJson(req, 20_000);
  // Honeypot: real users never fill the hidden "company" field.
  if (isPlainObject(body) && typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ success: true, message: "Data saved successfully" });
  }
  const parsed = validateFields("contact", body, ["name", "email", "message"]);
  if (!parsed.ok) {
    return NextResponse.json({ success: false, message: parsed.error }, { status: 400 });
  }
  try {
    await connectToDB();
    await Contact.create(parsed.data);
    return NextResponse.json({ success: true, message: "Data saved successfully" });
  } catch (e) {
    console.error("[api/contact/add]", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { success: false, message: "Something goes wrong !Please try again" },
      { status: 500 }
    );
  }
}
