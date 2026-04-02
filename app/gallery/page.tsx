"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GalleryRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/en/gallery");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to gallery...</p>
    </div>
  );
}
