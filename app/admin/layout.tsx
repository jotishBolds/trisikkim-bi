"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Newspaper,
  Award,
  Presentation,
  BookOpen,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Hero Slides", href: "/admin/hero-slides", icon: Presentation },
  { label: "Dignitaries", href: "/admin/dignitaries", icon: Award },
  { label: "Tribes", href: "/admin/tribes", icon: Users },
  { label: "Staff", href: "/admin/staff", icon: Users },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Updates", href: "/admin/updates", icon: Newspaper },
  { label: "About Page", href: "/admin/about", icon: BookOpen, exact: true },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-white">
        <Loader2 className="w-5 h-5 text-[#1077a6] animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  const current =
    NAV.find((n) =>
      n.exact
        ? pathname === n.href
        : pathname === n.href || pathname.startsWith(n.href),
    )?.label || "Dashboard";

  return (
    <div className="min-h-[100dvh] bg-white flex">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-[100dvh] w-[230px] bg-white border-r border-[#1077a6]/10 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-3 right-3 p-1 rounded-md hover:bg-[#1077a6]/5 text-[#1a1550]/40"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-4 py-4 border-b border-[#1077a6]/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1077a6] flex items-center justify-center shrink-0">
              <span className="text-white font-extrabold text-[10px]">T</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1a1550] leading-none">
                TRITC
              </p>
              <p className="text-[9px] text-[#1a1550]/30 leading-none mt-0.5">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2.5">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium rounded-lg my-0.5 transition-all group",
                  active
                    ? "bg-[#1077a6] text-white shadow-sm shadow-[#1077a6]/20"
                    : "text-[#1a1550]/50 hover:text-[#1a1550] hover:bg-[#1077a6]/[0.05]",
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    active
                      ? "text-[#f4c430]"
                      : "text-[#1077a6]/40 group-hover:text-[#1077a6]",
                  )}
                />
                <span className="truncate">{item.label}</span>
                {active && (
                  <ChevronRight className="w-3 h-3 ml-auto text-white/60" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#1077a6]/8">
          <div className="flex items-center gap-2.5 mb-2.5 px-1">
            <div className="w-7 h-7 rounded-full bg-[#1077a6]/10 text-[#1077a6] flex items-center justify-center text-[10px] font-bold shrink-0">
              {session.user.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-[#1a1550] truncate">
                {session.user.name}
              </p>
              <p className="text-[9px] text-[#1a1550]/30 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full h-8 text-[11px] text-[#1a1550]/40 hover:text-red-500 hover:bg-red-50 justify-center gap-1.5 rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#1077a6]/8 px-3 lg:px-5 h-12 flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#1077a6]/5 text-[#1a1550]/50"
          >
            <Menu className="w-4 h-4" />
          </button>

          <motion.h1
            key={current}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-bold text-[#1a1550] flex-1"
          >
            {current}
          </motion.h1>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 text-[10px] text-[#1077a6] font-semibold hover:text-[#1077a6]/70 transition-colors"
          >
            View Site <ExternalLink className="w-3 h-3" />
          </Link>
        </header>

        <main className="flex-1 p-3 lg:p-5 bg-[#f8f9fb]">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
