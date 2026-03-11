"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideShell =
    pathname.startsWith("/admin") || pathname.startsWith("/auth");

  // ── Auto visitor tracking (once per browser session) ──
  useEffect(() => {
    if (hideShell) return;
    if (typeof sessionStorage === "undefined") return;
    if (sessionStorage.getItem("_visited")) return;
    sessionStorage.setItem("_visited", "1");
    fetch("/api/settings/visitors", { method: "POST" }).catch(() => {});
  }, [hideShell]);

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    // ── Block right-click and image drag on public pages ──
    <div
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className="select-none"
    >
      <AccessibilityToolbar />
      <Navbar />
      <main className="flex-1 select-text">{children}</main>
      <Footer />
    </div>
  );
}
