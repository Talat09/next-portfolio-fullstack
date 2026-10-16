import connectToDB from "@/database";
import Project from "@/models/Project";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// PUT { ids: string[] } -> sets order = index for each project id
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    let body: { ids?: unknown } | null = null;
    try {
      body = await req.json();
    } catch (e) {
      body = null;
    }
    const ids = body?.ids;
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !ids.every(
        (id): id is string =>
          typeof id === "string" && mongoose.Types.ObjectId.isValid(id)
      ) ||
      new Set(ids).size !== ids.length
    ) {
      return NextResponse.json({
        success: false,
        message: "A non-empty array of unique, valid project ids is required",
      });
    }

    await connectToDB();
    const result = await Project.bulkWrite(
      ids.map((id, index) => ({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(id) },
          update: { $set: { order: index } },
        },
      }))
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        message: "No matching projects found",
      });
    }
    return NextResponse.json({
      success: true,
      message:
        result.matchedCount === ids.length
          ? "Project order saved successfully"
          : `Project order saved (${result.matchedCount} of ${ids.length} projects found)`,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}
