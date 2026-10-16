import connectToDB from "@/database";
import Experience from "@/models/Experience";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function PUT(req) {
  try {
    await connectToDB();
    const extractData = await req.json();
    const { _id, position, company, duration, location, jobprofile } =
      extractData || {};
    if (!_id) {
      return NextResponse.json({
        success: false,
        message: "Experience id is required",
      });
    }
    const updateData = await Experience.findByIdAndUpdate(
      _id,
      { position, company, duration, location, jobprofile },
      { new: true }
    );
    if (updateData) {
      return NextResponse.json({
        success: true,
        message: "Experience updated successfully",
        data: updateData,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Experience not found",
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
