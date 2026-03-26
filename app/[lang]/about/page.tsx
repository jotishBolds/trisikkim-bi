"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function AboutPage() {
  const { lang, dict } = useTranslation();
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/pages/about")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          const c = res.data.content as Record<string, unknown>;
          const originalHtml = typeof c.content === "string" ? c.content : "";

          // Use stored Hindi translation from DB if available
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
      .catch(() => {});
  }, [lang]);

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      <div className="bg-[#1077A6] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f4c430 1px, transparent 1px), linear-gradient(90deg, #f4c430 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-[#f4c430]/8 to-transparent pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#f4c430]/5 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-[#f4c430]/15 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-[#f4c430]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#f4c430]">
                {dict.about.subtitle}
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-[clamp(26px,4vw,44px)] leading-tight tracking-tight mb-3">
              {dict.about.title}
            </h1>
            <div className="w-14 h-[3px] rounded-full bg-[#f4c430] mb-4" />
            <p className="text-white/65 text-[15px] max-w-2xl leading-relaxed">
              {dict.about.description}
            </p>
          </motion.div>
        </div>
      </div>

      {content && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-7xl mx-auto px-4 md:px-8 py-12"
        >
          <div
            className="prose prose-sm md:prose-base max-w-none prose-headings:text-[#1a1550] prose-a:text-[#1077A6] text-[#1a1550]/80"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
