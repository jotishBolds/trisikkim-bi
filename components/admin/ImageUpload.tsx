"use client";

import { useState, useCallback } from "react";
import { useUploadThing } from "@/lib/uploadthing-client";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  endpoint?: "imageUploader" | "galleryUploader";
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  endpoint = "imageUploader",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        onChange(res[0].ufsUrl);
      }
      setUploading(false);
    },
    onUploadError: (err) => {
      setError(err.message || "Upload failed");
      setUploading(false);
    },
  });

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError("");

      // Client-side validation
      if (file.size > 1 * 1024 * 1024) {
        setError("File must be under 1MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return;
      }

      setUploading(true);
      await startUpload([file]);
    },
    [startUpload],
  );

  return (
    <div>
      <label className="block text-xs font-semibold text-[#1a1550]/60 mb-1">
        {label}
      </label>

      {value ? (
        <div className="relative w-full max-w-xs">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-[#1077A6]/15 bg-[#f8f7fc]">
            <Image
              src={value}
              alt="Uploaded"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full max-w-xs h-32 border-2 border-dashed border-[#1077A6]/20 rounded-lg cursor-pointer hover:border-[#1077A6]/40 hover:bg-[#1077A6]/5 transition-all duration-200">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-[#1077A6] animate-spin" />
              <span className="text-xs text-[#1a1550]/50">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-[#1077A6]/40" />
              <span className="text-xs text-[#1a1550]/50">
                Click to upload (max 1MB)
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      {error && (
        <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}
