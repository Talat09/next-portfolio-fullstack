// Shared, validated admin CRUD route handlers.
import type { Model } from "mongoose";
import { NextResponse, type NextRequest } from "next/server";
import connectToDB from "@/database";
import { requireAdmin } from "./auth";
import { revalidatePortfolio } from "./revalidate";
import {
  isPlainObject,
  isValidObjectIdString,
  readJson,
  validateFields,
  type Section,
} from "./validate";

const GENERIC_ERROR = "Something went wrong! Please try again";

function bad(message: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, message }, { status });
}

interface AddOptions {
  /** Only one document may exist in this collection */
  singleton?: boolean;
  successMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModel = Model<any>;

export function makeAddHandler(model: AnyModel, section: Section, options: AddOptions = {}) {
  return async function POST(req: NextRequest): Promise<NextResponse> {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const parsed = validateFields(section, await readJson(req));
    if (!parsed.ok) return bad(parsed.error);
    try {
      await connectToDB();
      if (options.singleton && (await model.findOne({}))) {
        return bad("This item already exists. Please update it instead.", 409);
      }
      const saved = await model.create(parsed.data);
      if (saved) revalidatePortfolio();
      return saved
        ? NextResponse.json({
            success: true,
            message: options.successMessage || "Data saved successfully",
          })
        : bad(GENERIC_ERROR, 500);
    } catch (e) {
      console.error(`[api/${section}/add]`, e instanceof Error ? e.message : e);
      return bad(GENERIC_ERROR, 500);
    }
  };
}

export function makeUpdateHandler(model: AnyModel, section: Section, label: string) {
  return async function PUT(req: NextRequest): Promise<NextResponse> {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const body = await readJson(req);
    if (!isPlainObject(body) || !isValidObjectIdString(body._id)) {
      return bad(`A valid ${label.toLowerCase()} id is required`);
    }
    const parsed = validateFields(section, body);
    if (!parsed.ok) return bad(parsed.error);
    try {
      await connectToDB();
      const updated = await model.findByIdAndUpdate(body._id, parsed.data, {
        new: true,
        runValidators: true,
      });
      if (updated) revalidatePortfolio();
      return updated
        ? NextResponse.json({
            success: true,
            message: `${label} updated successfully`,
            data: updated,
          })
        : bad(`${label} not found`, 404);
    } catch (e) {
      console.error(`[api/${section}/update]`, e instanceof Error ? e.message : e);
      return bad(GENERIC_ERROR, 500);
    }
  };
}

export function makeDeleteHandler(model: AnyModel, section: Section, label: string) {
  return async function DELETE(req: NextRequest): Promise<NextResponse> {
    const denied = requireAdmin(req);
    if (denied) return denied;
    let id: unknown = req.nextUrl.searchParams.get("id");
    if (!id) {
      const body = await readJson(req);
      if (isPlainObject(body)) id = body.id ?? body._id;
    }
    if (!isValidObjectIdString(id)) {
      return bad(`A valid ${label.toLowerCase()} id is required`);
    }
    try {
      await connectToDB();
      const deleted = await model.findByIdAndDelete(id);
      if (deleted) revalidatePortfolio();
      return deleted
        ? NextResponse.json({
            success: true,
            message: `${label} deleted successfully`,
            data: deleted,
          })
        : bad(`${label} not found`, 404);
    } catch (e) {
      console.error(`[api/${section}/delete]`, e instanceof Error ? e.message : e);
      return bad(GENERIC_ERROR, 500);
    }
  };
}
