"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublicationDetailRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/en/updates/publications");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to publications...</p>
    </div>
  );
}
