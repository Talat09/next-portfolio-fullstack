import connectToDB from "@/database";
import Experience from "@/models/Experience";
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
        message: "Experience id is required",
      });
    }
    const deletedData = await Experience.findByIdAndDelete(id);
    if (deletedData) {
      return NextResponse.json({
        success: true,
        message: "Experience deleted successfully",
        data: deletedData,
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
