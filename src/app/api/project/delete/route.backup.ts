import connectToDB from "@/database";
import Project from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    await connectToDB();
    let id = new URL(req.url).searchParams.get("id");
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id || body?._id;
      } catch (e) {
        // no JSON body
      }
    }
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Project id is required",
      });
    }
    const deletedData = await Project.findByIdAndDelete(id);
    if (deletedData) {
      return NextResponse.json({
        success: true,
        message: "Project deleted successfully",
        data: deletedData,
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
