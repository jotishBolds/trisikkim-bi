"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageHeroProps = {
  badge?: string;
  title: string;
  caption?: string;
  icon?: ReactNode;
};

export default function PageHero({ title, caption }: PageHeroProps) {
  return (
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

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display font-bold text-white text-[clamp(22px,3vw,36px)] leading-tight tracking-tight mb-3">
            {title}
          </h1>

          <div className="w-14 h-[3px] rounded-full bg-[#f4c430]" />

          {caption && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-4 text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-4xl"
            >
              {caption}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
