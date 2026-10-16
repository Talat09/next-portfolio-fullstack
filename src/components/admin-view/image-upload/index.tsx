"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/services";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const MAX_BYTES = 5 * 1024 * 1024;

/** Picks an image, previews it and uploads it to /api/upload (Cloudinary). */
export default function ImageUpload({
  value,
  onChange,
  onUploadingChange,
  label = "Project Image",
}: {
  value: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const uploading = progress !== null;
  const preview = localPreview || value;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!ACCEPT.split(",").includes(file.type)) {
      setError("Only JPEG, PNG, WebP or AVIF images are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image is too large (max 5 MB).");
      return;
    }
    setLocalPreview(URL.createObjectURL(file));
    setProgress(0);
    onUploadingChange?.(true);
    const result = await uploadImage(file, setProgress);
    setProgress(null);
    onUploadingChange?.(false);
    if (result.success && result.data?.url) {
      onChange(result.data.url);
      setLocalPreview(null);
    } else {
      setLocalPreview(null);
      setError(result.message || "Upload failed. Please try again.");
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="mt-5 flex flex-col gap-2">
      <span className="text-sm font-semibold text-[#111827]">{label}</span>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="relative h-28 w-48 shrink-0 overflow-hidden rounded-xl border border-[#e3efe8] bg-[#f8fcfa] flex items-center justify-center">
          {preview ? (
            <Image
              src={preview}
              alt="Project image preview"
              fill
              sizes="192px"
              unoptimized
              className={`object-cover ${uploading ? "opacity-60" : ""}`}
            />
          ) : (
            <span className="text-xs text-[#6b7280]">No image</span>
          )}
          {uploading ? (
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#e3efe8]">
              <div
                className="h-full bg-[#1a9e55] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border-[1.5px] border-[#1a9e55] px-4 py-2 text-sm font-semibold text-[#1a9e55] hover:bg-[#e8f6ee] transition-colors disabled:opacity-50"
            >
              {uploading ? `Uploading ${progress}%` : value ? "Change Image" : "Upload Image"}
            </button>
            {value && !uploading ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-lg border-[1.5px] border-[#d1d5db] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#f3f4f6] transition-colors"
              >
                Remove
              </button>
            ) : null}
          </div>
          <p className="text-xs text-[#6b7280]">
            JPEG, PNG, WebP or AVIF, max 5 MB. 16:9 (e.g. 1200×675) looks best.
          </p>
          {error ? (
            <p role="alert" className="text-xs font-medium text-[#dc2626]">
              {error}
            </p>
          ) : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
