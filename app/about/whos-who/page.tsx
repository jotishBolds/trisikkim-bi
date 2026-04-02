"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WhosWhoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/en/about/whos-who");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to who's who...</p>
    </div>
  );
}
