"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function TribeDetailRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const id = params.id;
    router.replace(`/en/tribes/${id}`);
  }, [router, params.id]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to tribe details...</p>
    </div>
  );
}
