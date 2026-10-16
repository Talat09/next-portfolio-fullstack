// Admin only: uploads one project image to Cloudinary and returns its URL.
// Nothing is written to the database here; the URL is saved with the project form.
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  MAX_IMAGE_BYTES,
  detectImageKind,
  getCloudinaryConfig,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function bad(message: string, status = 400, headers?: HeadersInit): NextResponse {
  return NextResponse.json({ success: false, message }, { status, headers });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const limit = rateLimit(`upload:${getClientIp(req)}`, 20, 10 * 60 * 1000);
  if (!limit.ok) {
    return bad("Too many uploads. Please try again later.", 429, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  const config = getCloudinaryConfig();
  if (!config) {
    return bad(
      "Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
      503
    );
  }

  const length = Number(req.headers.get("content-length") || "0");
  if (length > MAX_IMAGE_BYTES + 64 * 1024) return bad("Image is too large (max 5 MB)", 413);

  let file: FormDataEntryValue | null = null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return bad("Invalid upload. Send multipart/form-data with a \"file\" field.");
  }
  if (!file || typeof file === "string") return bad("No image file received");
  if (file.size === 0) return bad("The image file is empty");
  if (file.size > MAX_IMAGE_BYTES) return bad("Image is too large (max 5 MB)", 413);
  if (!ALLOWED_TYPES.has(file.type)) return bad("Only JPEG, PNG, WebP or AVIF images are allowed", 415);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = detectImageKind(bytes);
  if (!kind) return bad("The file is not a valid JPEG, PNG, WebP or AVIF image", 415);

  try {
    const result = await uploadImageToCloudinary(bytes, kind, config);
    return NextResponse.json({
      success: true,
      message: "Image uploaded",
      data: { url: result.secureUrl, width: result.width, height: result.height },
    });
  } catch (e) {
    console.error("[api/upload]", e instanceof Error ? e.message : e);
    return bad("Image upload failed. Please try again.", 502);
  }
}
