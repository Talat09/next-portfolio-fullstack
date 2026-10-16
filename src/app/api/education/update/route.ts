import connectToDB from "@/database";
import Education from "@/models/Education";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    await connectToDB();
    const extractData = await req.json();
    const { _id, degree, year, college } =
      extractData || {};
    if (!_id) {
      return NextResponse.json({
        success: false,
        message: "Education id is required",
      });
    }
    const updateData = await Education.findByIdAndUpdate(
      _id,
      { degree, year, college },
      { new: true }
    );
    if (updateData) {
      return NextResponse.json({
        success: true,
        message: "Education updated successfully",
        data: updateData,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Education not found",
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
