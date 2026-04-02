"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function UpdatesCategoryRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const category = params.category;
    router.replace(`/en/updates/${category}`);
  }, [router, params.category]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to updates...</p>
    </div>
  );
}
