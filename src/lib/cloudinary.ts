// Server-only Cloudinary helpers: signed REST upload (no SDK) + image checks.
import "server-only";
import { createHash } from "node:crypto";

export const UPLOAD_FOLDER = "portfolio/projects";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type ImageKind = "jpeg" | "png" | "webp" | "avif";

const MIME: Record<ImageKind, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

/** Detects the real image type from its first bytes (magic numbers). */
export function detectImageKind(b: Uint8Array): ImageKind | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
    b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
  ) return "png";
  const ascii = (s: number, e: number) => String.fromCharCode(...b.subarray(s, e));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (ascii(4, 8) === "ftyp") {
    const brand = ascii(8, 12);
    if (brand === "avif" || brand === "avis") return "avif";
  }
  return null;
}

export function mimeFor(kind: ImageKind): string {
  return MIME[kind];
}

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

/** Cloudinary signature: sorted "k=v&k=v" params + secret, SHA-1 hex. */
export function signParams(params: Record<string, string>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

export async function uploadImageToCloudinary(
  bytes: Uint8Array,
  kind: ImageKind,
  config: CloudinaryConfig
): Promise<{ secureUrl: string; width?: number; height?: number }> {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const params = { folder: UPLOAD_FOLDER, timestamp };
  const form = new FormData();
  form.append("file", new Blob([bytes as BlobPart], { type: mimeFor(kind) }), `upload.${kind}`);
  form.append("api_key", config.apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", UPLOAD_FOLDER);
  form.append("signature", signParams(params, config.apiSecret));

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`,
    { method: "POST", body: form, signal: AbortSignal.timeout(30_000) }
  );
  const json = (await res.json().catch(() => null)) as {
    secure_url?: string;
    width?: number;
    height?: number;
    error?: { message?: string };
  } | null;
  if (!res.ok || !json?.secure_url) {
    throw new Error(json?.error?.message || `Cloudinary upload failed (${res.status})`);
  }
  return { secureUrl: json.secure_url, width: json.width, height: json.height };
}
