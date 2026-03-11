"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Presentation,
  Users,
  ImageIcon,
  MessageSquare,
  Newspaper,
  Award,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  heroSlides: number;
  tribes: number;
  staff: number;
  galleryCategories: number;
  galleryImages: number;
  contactMessages: number;
  unreadMessages: number;
  dignitaries: number;
  updates: number;
}

const CARD_THEMES = [
  {
    gradient: "from-[#1077a6] via-[#0e8fc4] to-[#0ba3e0]",
    glow: "rgba(16,119,166,0.35)",
    shimmer: "rgba(255,255,255,0.12)",
    iconBg: "rgba(255,255,255,0.18)",
    textMuted: "rgba(255,255,255,0.65)",
    border: "rgba(255,255,255,0.2)",
  },
  {
    gradient: "from-[#f4c430] via-[#f0b429] to-[#e8a020]",
    glow: "rgba(244,196,48,0.4)",
    shimmer: "rgba(255,255,255,0.15)",
    iconBg: "rgba(255,255,255,0.2)",
    textMuted: "rgba(26,21,80,0.6)",
    border: "rgba(255,255,255,0.3)",
    dark: true,
  },
  {
    gradient: "from-[#1a1550] via-[#231d6b] to-[#2d2585]",
    glow: "rgba(26,21,80,0.4)",
    shimmer: "rgba(255,255,255,0.08)",
    iconBg: "rgba(255,255,255,0.12)",
    textMuted: "rgba(255,255,255,0.55)",
    border: "rgba(255,255,255,0.12)",
  },
  {
    gradient: "from-[#0e7bb5] via-[#1077a6] to-[#1a1550]",
    glow: "rgba(16,119,166,0.3)",
    shimmer: "rgba(255,255,255,0.1)",
    iconBg: "rgba(255,255,255,0.15)",
    textMuted: "rgba(255,255,255,0.6)",
    border: "rgba(255,255,255,0.15)",
  },
  {
    gradient: "from-[#f4c430] via-[#f9d068] to-[#fde28a]",
    glow: "rgba(244,196,48,0.35)",
    shimmer: "rgba(255,255,255,0.2)",
    iconBg: "rgba(26,21,80,0.12)",
    textMuted: "rgba(26,21,80,0.55)",
    border: "rgba(255,255,255,0.35)",
    dark: true,
  },
  {
    gradient: "from-[#1a1550] via-[#1077a6] to-[#0e9fd8]",
    glow: "rgba(16,119,166,0.35)",
    shimmer: "rgba(255,255,255,0.1)",
    iconBg: "rgba(255,255,255,0.15)",
    textMuted: "rgba(255,255,255,0.6)",
    border: "rgba(255,255,255,0.14)",
  },
  {
    gradient: "from-[#1077a6] via-[#1a5fa0] to-[#1a1550]",
    glow: "rgba(26,21,80,0.35)",
    shimmer: "rgba(255,255,255,0.09)",
    iconBg: "rgba(255,255,255,0.14)",
    textMuted: "rgba(255,255,255,0.58)",
    border: "rgba(255,255,255,0.13)",
  },
  {
    gradient: "from-[#e8a020] via-[#f4c430] to-[#1077a6]",
    glow: "rgba(244,196,48,0.3)",
    shimmer: "rgba(255,255,255,0.12)",
    iconBg: "rgba(255,255,255,0.18)",
    textMuted: "rgba(255,255,255,0.65)",
    border: "rgba(255,255,255,0.2)",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d.data);
        else setError(d.error || "Failed to load.");
      })
      .catch(() => setError("Failed to connect."));
  }, []);

  if (error) {
    return (
      <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-lg p-3 text-xs border border-red-100">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 animate-pulse h-[110px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(16,119,166,0.08) 0%, rgba(244,196,48,0.06) 100%)",
              border: "1px solid rgba(16,119,166,0.1)",
            }}
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Hero Slides",
      value: stats.heroSlides,
      icon: Presentation,
      trend: "Active",
    },
    {
      label: "Dignitaries",
      value: stats.dignitaries,
      icon: Award,
      trend: "Listed",
    },
    {
      label: "Tribes",
      value: stats.tribes,
      icon: Users,
      trend: "Registered",
    },
    {
      label: "Staff Members",
      value: stats.staff,
      icon: Users,
      trend: "Active",
    },
    {
      label: "Gallery Categories",
      value: stats.galleryCategories,
      icon: ImageIcon,
      trend: "Albums",
    },
    {
      label: "Gallery Images",
      value: stats.galleryImages,
      icon: ImageIcon,
      trend: "Photos",
    },
    {
      label: "Updates",
      value: stats.updates,
      icon: Newspaper,
      trend: "Published",
    },
    {
      label: "Messages",
      value: stats.contactMessages,
      icon: MessageSquare,
      trend:
        stats.unreadMessages > 0
          ? `${stats.unreadMessages} unread`
          : "All read",
      hasUnread: stats.unreadMessages > 0,
      unreadCount: stats.unreadMessages,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, i) => {
          const theme = CARD_THEMES[i % CARD_THEMES.length];
          const isLight = theme.dark;
          const textColor = isLight ? "#1a1550" : "#ffffff";
          const mutedColor = theme.textMuted;

          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: i * 0.06,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative overflow-hidden rounded-xl cursor-default group"
              style={{
                boxShadow: `0 4px 24px ${theme.glow}, 0 1px 0 ${theme.border} inset`,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}
              />

              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 30% 20%, ${theme.shimmer} 0%, transparent 60%)`,
                }}
              />

              <div
                className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-[0.12] group-hover:opacity-[0.2] transition-opacity"
                style={{ background: isLight ? "#1a1550" : "#ffffff" }}
              />

              <div
                className="absolute -bottom-6 -left-3 w-16 h-16 rounded-full opacity-[0.08]"
                style={{ background: isLight ? "#1a1550" : "#ffffff" }}
              />

              <div className="relative z-10 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: theme.iconBg }}
                  >
                    <card.icon
                      className="w-4 h-4"
                      style={{ color: textColor }}
                    />
                  </div>

                  {"hasUnread" in card && card.hasUnread && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.06 + 0.3, type: "spring" }}
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "rgba(239,68,68,0.9)",
                        color: "#fff",
                      }}
                    >
                      {card.unreadCount} new
                    </motion.span>
                  )}
                </div>

                <motion.p
                  className="text-2xl font-black leading-none mb-1"
                  style={{ color: textColor }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 + 0.15 }}
                >
                  {card.value}
                </motion.p>

                <div className="flex items-end justify-between gap-1 mt-1.5">
                  <span
                    className="text-[11px] font-semibold leading-tight"
                    style={{ color: textColor, opacity: 0.9 }}
                  >
                    {card.label}
                  </span>
                  <div
                    className="flex items-center gap-0.5 shrink-0"
                    style={{ color: mutedColor }}
                  >
                    <TrendingUp className="w-2.5 h-2.5" />
                    <span className="text-[9px] font-medium">{card.trend}</span>
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-40"
                style={{
                  background: `linear-gradient(90deg, transparent, ${isLight ? "#1a1550" : "#ffffff"} 50%, transparent)`,
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
