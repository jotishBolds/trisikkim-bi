"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";
import PageHero from "@/components/PageHero";

function SkeletonContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-pulse space-y-4">
      <div className="h-5 w-1/3 bg-[#1a1550]/8 rounded-full" />
      <div className="h-4 w-full bg-[#1a1550]/6 rounded-full" />
      <div className="h-4 w-5/6 bg-[#1a1550]/6 rounded-full" />
      <div className="h-4 w-4/5 bg-[#1a1550]/6 rounded-full" />
      <div className="h-4 w-full bg-[#1a1550]/6 rounded-full" />
      <div className="h-4 w-3/4 bg-[#1a1550]/6 rounded-full" />
      <div className="mt-4 h-5 w-1/4 bg-[#1a1550]/8 rounded-full" />
      <div className="h-4 w-full bg-[#1a1550]/6 rounded-full" />
      <div className="h-4 w-5/6 bg-[#1a1550]/6 rounded-full" />
    </div>
  );
}

export default function AboutPage() {
  const { lang, dict } = useTranslation();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/pages/about")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          const c = res.data.content as Record<string, unknown>;
          const originalHtml = typeof c.content === "string" ? c.content : "";
          const tr = res.data.translations as
            | { hi?: { content?: string } }
            | null
            | undefined;
          if (lang !== "en" && tr?.hi?.content) {
            setContent(tr.hi.content);
          } else {
            setContent(originalHtml);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lang]);

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      {/* CR-10: PageHero replaces old hero block */}
      <PageHero
        badge={dict.about.subtitle}
        title={dict.about.title}
        icon={<BookOpen className="w-3.5 h-3.5 text-[#f4c430]" />}
      />

      {loading ? (
        <SkeletonContent />
      ) : content ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-7xl mx-auto px-4 md:px-8 py-12"
        >
          <div
            className="prose prose-sm md:prose-base max-w-none prose-headings:text-[#1a1550] prose-a:text-[#1077A6] text-[#1a1550]/80"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </motion.div>
      ) : null}
    </div>
  );
}
