// Admin only: contact-form messages contain personal data.
import connectToDB from "@/database";
import Contact from "@/models/Contact";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    await connectToDB();
    const extractData = await Contact.find({}).sort({ createdAt: -1 }).limit(500);
    return NextResponse.json(
      { success: true, data: extractData },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (e) {
    console.error("[api/contact/get]", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { success: false, message: "Something went wrong !Please try again" },
      { status: 500 }
    );
  }
}
