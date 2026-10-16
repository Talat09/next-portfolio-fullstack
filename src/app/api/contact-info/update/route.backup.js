import connectToDB from "@/database";
import ContactInfo from "@/models/ContactInfo";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function PUT(req) {
  try {
    await connectToDB();
    const { _id, label, heading, highlight, intro, email, location } =
      (await req.json()) || {};
    if (!_id) {
      return NextResponse.json({
        success: false,
        message: "Contact info id is required",
      });
    }
    const updateData = await ContactInfo.findByIdAndUpdate(
      _id,
      { label, heading, highlight, intro, email, location },
      { new: true }
    );
    if (updateData) {
      return NextResponse.json({
        success: true,
        message: "Contact info updated successfully",
        data: updateData,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Contact info not found",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}
