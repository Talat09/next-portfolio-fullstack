import connectToDB from "@/database";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function PUT(req) {
  try {
    await connectToDB();
    const extractData = await req.json();
    const { _id, name, website, technologies, github } = extractData || {};
    if (!_id) {
      return NextResponse.json({
        success: false,
        message: "Project id is required",
      });
    }
    const updateData = await Project.findByIdAndUpdate(
      _id,
      { name, website, technologies, github },
      { new: true }
    );
    if (updateData) {
      return NextResponse.json({
        success: true,
        message: "Project updated successfully",
        data: updateData,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Project not found",
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
