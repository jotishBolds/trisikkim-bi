"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContactRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/en/contact");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to contact...</p>
    </div>
  );
}
