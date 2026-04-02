"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AboutRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/en/about");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to about...</p>
    </div>
  );
}
