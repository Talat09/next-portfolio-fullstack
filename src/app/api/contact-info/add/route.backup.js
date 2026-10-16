import connectToDB from "@/database";
import ContactInfo from "@/models/ContactInfo";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(req) {
  try {
    await connectToDB();
    const { label, heading, highlight, intro, email, location } =
      (await req.json()) || {};
    // single-document collection: refuse to create a second one
    const existing = await ContactInfo.findOne({});
    if (existing) {
      return NextResponse.json({
        success: false,
        message: "Contact info already exists. Please update it instead.",
      });
    }
    const savedData = await ContactInfo.create({
      label,
      heading,
      highlight,
      intro,
      email,
      location,
    });
    if (savedData) {
      return NextResponse.json({
        success: true,
        message: "Contact info saved successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Something went wrong ! Please try again",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again",
    });
  }
}
