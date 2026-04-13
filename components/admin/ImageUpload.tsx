// components/admin/ImageUpload.tsx
"use client";

import { useState, useCallback } from "react";
import { useUploadThing } from "@/lib/uploadthing-client";
import { Upload, X, Loader2, AlertCircle, FileText } from "lucide-react";
import Image from "next/image";

type UploadEndpoint =
  | "imageUploader"
  | "galleryUploader"
  | "pdfUploader"
  | "publicationPdfUploader"
  | "archivePdfUploader"
  | "circularPdfUploader";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  endpoint?: UploadEndpoint;
  fileType?: "image" | "pdf";
}

// File size limits in bytes
const FILE_SIZE_LIMITS: Record<UploadEndpoint, number> = {
  imageUploader: 32 * 1024 * 1024, // 32MB
  galleryUploader: 32 * 1024 * 1024, // 32MB
  pdfUploader: 4 * 1024 * 1024, // 4MB (legacy)
  publicationPdfUploader: 15 * 1024 * 1024, // 15MB (user-facing limit)
  archivePdfUploader: 15 * 1024 * 1024, // 15MB (user-facing limit)
  circularPdfUploader: 10 * 1024 * 1024, // 10MB (user-facing limit)
};

// Human-readable size labels
const FILE_SIZE_LABELS: Record<UploadEndpoint, string> = {
  imageUploader: "32MB",
  galleryUploader: "32MB",
  pdfUploader: "4MB",
  publicationPdfUploader: "15MB",
  archivePdfUploader: "15MB",
  circularPdfUploader: "10MB",
};

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  endpoint = "imageUploader",
  fileType = "image",
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

  const maxFileSize = FILE_SIZE_LIMITS[endpoint];
  const maxFileSizeLabel = FILE_SIZE_LABELS[endpoint];

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError("");

      // Client-side validation
      if (fileType === "pdf") {
        if (file.size > maxFileSize) {
          setError(`File must be under ${maxFileSizeLabel}`);
          return;
        }
        if (file.type !== "application/pdf") {
          setError("Only PDF files are accepted.");
          return;
        }
      } else {
        if (file.size > maxFileSize) {
          setError(`File must be under ${maxFileSizeLabel}`);
          return;
        }
        if (!file.type.startsWith("image/")) {
          setError("Only image files are allowed");
          return;
        }
      }

      setUploading(true);
      await startUpload([file]);
    },
    [startUpload, fileType, maxFileSize, maxFileSizeLabel],
  );

  return (
    <div>
      <label className="block text-xs font-semibold text-[#1a1550]/60 mb-1">
        {label}
      </label>

      {value ? (
        <div className="relative w-full max-w-xs">
          {fileType === "pdf" ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border border-[#1077A6]/15 rounded-lg bg-[#f8f7fc] hover:bg-[#1077A6]/5 transition-colors"
            >
              <FileText className="w-5 h-5 text-red-500 shrink-0" />
              <span className="text-xs text-[#1a1550] truncate">
                PDF Document
              </span>
            </a>
          ) : (
            <div className="relative aspect-video rounded-lg overflow-hidden border border-[#1077A6]/15 bg-[#f8f7fc]">
              <Image
                src={value}
                alt="Uploaded"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
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
              <span className="text-xs text-[#1a1550]/50 text-center px-2">
                {fileType === "pdf"
                  ? `Click to upload PDF (max ${maxFileSizeLabel})`
                  : `Click to upload image (max ${maxFileSizeLabel})`}
              </span>
            </div>
          )}
          <input
            type="file"
            accept={fileType === "pdf" ? "application/pdf" : "image/*"}
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
