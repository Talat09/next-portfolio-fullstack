import { NextResponse } from "next/server";
import { getSectionData } from "@/lib/data";
export const dynamic = "force-dynamic";
export async function GET(): Promise<NextResponse> {
  const data = await getSectionData("contact-info");
  if (data) {
    return NextResponse.json({ success: true, data });
  }
  return NextResponse.json({
    success: false,
    message: "Something went wrong! Please try again",
  });
}