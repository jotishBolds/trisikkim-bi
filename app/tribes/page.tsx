"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TribesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/en/tribes");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to tribes...</p>
    </div>
  );
}
