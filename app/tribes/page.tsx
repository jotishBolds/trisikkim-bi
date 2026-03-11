"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, Sparkles } from "lucide-react";

interface TribeData {
  id: string;
  name: string;
  image: string;
  excerpt: string;
  accent?: string;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse bg-white border border-[#1077A6]/8">
      <div className="h-64 bg-gradient-to-br from-[#1077A6]/10 to-[#1a1550]/8" />
      <div className="p-6 space-y-3">
        <div className="h-6 w-2/3 bg-[#1a1550]/8 rounded-full" />
        <div className="h-4 w-full bg-[#1a1550]/6 rounded-full" />
        <div className="h-4 w-4/5 bg-[#1a1550]/6 rounded-full" />
      </div>
    </div>
  );
}

export default function TribesPage() {
  const [tribes, setTribes] = useState<TribeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tribes")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTribes(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      <div className="relative bg-[#1077A6] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#f4c430 1px, transparent 1px), linear-gradient(90deg, #f4c430 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(244,196,48,0.18),transparent)]" />

        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#1a1550]/30 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <div className="w-8 h-8 rounded-lg bg-[#f4c430]/15 border border-[#f4c430]/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#f4c430]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[.2em] text-[#f4c430]">
                Indigenous Communities
              </span>
            </motion.div>

            <h1
              className="font-display font-black text-white leading-[1.05] tracking-tight mb-5"
              style={{ fontSize: "clamp(42px, 7vw, 80px)" }}
            >
              Sikkimese
              <br />
              <span className="text-[#f4c430]">Tribes</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-white/60 text-[16px] md:text-[18px] max-w-lg leading-relaxed"
            >
              Celebrating the rich heritage, traditions, and enduring legacy of
              Sikkim&apos;s indigenous tribal communities.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block"
          >
            <div className="w-48 h-48 rounded-full border-2 border-[#f4c430]/10 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-[#f4c430]/15 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#f4c430]/10 border border-[#f4c430]/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#f4c430]/60" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-[#f8f7fc]"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : tribes.length === 0 ? (
          <div className="text-center py-32">
            <Users className="w-16 h-16 text-[#1a1550]/10 mx-auto mb-4" />
            <p className="text-[#1a1550]/40 text-[16px]">No tribes found.</p>
          </div>
        ) : (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[13px] font-medium text-[#1a1550]/35 mb-8 tracking-wide"
            >
              {tribes.length} tribe{tribes.length !== 1 ? "s" : ""} documented
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {tribes.map((tribe, i) => (
                <motion.div
                  key={tribe.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={`/tribes/${tribe.id}`}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#1077A6]/10 hover:border-[#f4c430]/40 hover:shadow-2xl hover:shadow-[#1077A6]/10 transition-all duration-400 h-full"
                  >
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#1077A6]/10 to-[#1a1550]/10 flex-shrink-0">
                      {tribe.image ? (
                        <Image
                          src={tribe.image}
                          alt={tribe.name}
                          fill
                          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-12 h-12 text-[#1077A6]/20" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1550]/70 via-[#1a1550]/10 to-transparent" />

                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 bg-[#1a1550]/50 backdrop-blur-sm text-[#f4c430] text-[10px] font-bold uppercase tracking-[.14em] px-2.5 py-1.5 rounded-full border border-[#f4c430]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f4c430]" />
                          Sikkimese Tribe
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h2 className="font-display font-black text-white text-[22px] md:text-[24px] leading-tight tracking-tight group-hover:text-[#f4c430] transition-colors duration-300">
                          {tribe.name}
                        </h2>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      {tribe.excerpt ? (
                        <p className="text-[#1a1550]/55 text-[13.5px] leading-relaxed line-clamp-3 flex-1">
                          {tribe.excerpt}
                        </p>
                      ) : (
                        <p className="text-[#1a1550]/25 text-[13.5px] italic flex-1">
                          No description available.
                        </p>
                      )}

                      <div className="mt-4 pt-4 border-t border-[#1077A6]/8 flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#1077A6] group-hover:text-[#f4c430] transition-colors flex items-center gap-1.5">
                          Explore culture
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                        </span>
                        <div className="w-7 h-7 rounded-full bg-[#1077A6]/8 group-hover:bg-[#f4c430]/15 flex items-center justify-center transition-colors duration-300">
                          <ArrowRight className="w-3 h-3 text-[#1077A6] group-hover:text-[#f4c430] group-hover:translate-x-0.5 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
