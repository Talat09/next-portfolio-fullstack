import connectToDB from "@/database";
import About from "@/models/About";
import Home from "@/models/Home";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    await connectToDB();
    const extractData = await About.find({});
    if (extractData) {
      return NextResponse.json({
        success: true,
        data: extractData,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Something went wrong! Please try again",
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
