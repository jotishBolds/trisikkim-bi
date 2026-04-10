"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Images,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react";

interface GalleryItem {
  url: string;
  label: string;
}

interface TribeDetailContentProps {
  tribe: {
    id: string;
    name: string;
    heroImage: string;
    content: string;
    excerpt?: string | null;
    gallery?: GalleryItem[];
  };
  prevTribe: { id: string; name: string } | null;
  nextTribe: { id: string; name: string } | null;
}

export function TribeDetailContent({
  tribe,
  prevTribe,
  nextTribe,
}: TribeDetailContentProps) {
  const gallery = tribe.gallery ?? [];
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const closeLightbox = () => setLightboxIdx(null);
  const goPrev = () =>
    setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : gallery.length - 1));
  const goNext = () =>
    setLightboxIdx((i) => (i !== null && i < gallery.length - 1 ? i + 1 : 0));

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      <div className="relative bg-[#1077A6] overflow-hidden">
        {tribe.heroImage && (
          <>
            <Image
              src={tribe.heroImage}
              alt={tribe.name}
              fill
              className="object-cover opacity-35"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1077A6]/98 via-[#1077A6]/75 to-[#1a1550]/40" />
          </>
        )}

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f4c430 1px, transparent 1px), linear-gradient(90deg, #f4c430 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_0%_50%,rgba(244,196,48,0.12),transparent)]" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-10 pt-10 pb-24 md:pb-36">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/tribes"
              className="inline-flex items-center gap-2 text-white/50 hover:text-[#f4c430] text-[15px] font-semibold mb-10 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              All Tribes
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 min-w-0"
            >
              <div className="mb-5">
                <span className="text-[18px] md:text-[28px] font-bold uppercase tracking-[.15em] text-[#f4c430] whitespace-nowrap">
                  Sikkimese Tribe
                </span>
              </div>

              <h1
                className="font-display font-black text-white leading-[0.9] tracking-[-0.02em] mb-7 whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  fontSize: "clamp(32px, 8vw, 160px)",
                  textShadow: "0 2px 60px rgba(0,0,0,0.35)",
                }}
              >
                {tribe.name}
              </h1>

              {tribe.excerpt && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="text-white/55 text-[16px] md:text-[20px] max-w-2xl leading-relaxed font-medium"
                >
                  {tribe.excerpt}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden lg:flex items-center gap-3 shrink-0"
            >
              {prevTribe && (
                <Link
                  href={`/tribes/${prevTribe.id}`}
                  className="group flex items-center gap-2 bg-white/10 hover:bg-[#f4c430]/15 border border-white/15 hover:border-[#f4c430]/30 text-white/70 hover:text-[#f4c430] text-[12px] font-semibold px-4 py-2.5 rounded-full transition-all duration-300"
                >
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  {prevTribe.name}
                </Link>
              )}
              {nextTribe && (
                <Link
                  href={`/tribes/${nextTribe.id}`}
                  className="group flex items-center gap-2 bg-white/10 hover:bg-[#f4c430]/15 border border-white/15 hover:border-[#f4c430]/30 text-white/70 hover:text-[#f4c430] text-[12px] font-semibold px-4 py-2.5 rounded-full transition-all duration-300"
                >
                  {nextTribe.name}
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-14 bg-[#f8f7fc]"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.18 }}
        className="max-w-4xl mx-auto px-5 md:px-8 pt-6 pb-20"
      >
        {tribe.content && tribe.content.trim() !== "" ? (
          <div
            className="
              prose prose-lg max-w-none
              text-[#1a1550]/70
              prose-headings:font-display prose-headings:text-[#1a1550] prose-headings:font-black prose-headings:tracking-tight
              prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
              prose-h2:border-b prose-h2:border-[#1077A6]/10 prose-h2:pb-3
              prose-a:text-[#1077A6] prose-a:font-semibold prose-a:no-underline hover:prose-a:text-[#f4c430] hover:prose-a:underline
              prose-strong:text-[#1a1550] prose-strong:font-bold
              prose-blockquote:border-l-4 prose-blockquote:border-[#f4c430] prose-blockquote:bg-[#f4c430]/6 prose-blockquote:rounded-r-xl prose-blockquote:py-3 prose-blockquote:not-italic
              prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-[#1077A6]/10
              prose-ul:text-[#1a1550]/65 prose-ol:text-[#1a1550]/65
              prose-li:marker:text-[#1077A6]
              prose-code:bg-[#1077A6]/8 prose-code:text-[#1077A6] prose-code:px-1.5 prose-code:rounded-md prose-code:font-medium
              prose-hr:border-[#1077A6]/10
              prose-p:leading-relaxed
              [&_u]:underline
            "
            dangerouslySetInnerHTML={{ __html: tribe.content }}
          />
        ) : (
          <p className="text-[#1a1550]/30 text-[16px] text-center py-24 italic">
            Content coming soon.
          </p>
        )}

        {/* ── Gallery ── */}
        {gallery.length > 0 && (
          <div className="mt-16">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1B6B3A]/10 border border-[#1B6B3A]/20 flex items-center justify-center">
                <Images className="w-4 h-4 text-[#1B6B3A]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[.2em] text-[#1B6B3A]">
                Gallery
              </span>
              <span className="text-[11px] text-[#1a1550]/30 font-medium">
                {gallery.length} photo{gallery.length !== 1 ? "s" : ""}
              </span>
            </motion.div>
            <div className="w-full h-px bg-gradient-to-r from-[#1077A6]/15 via-[#f4c430]/25 to-transparent mb-8" />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {gallery.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group cursor-zoom-in"
                  onClick={() => setLightboxIdx(i)}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-[#1077A6]/10 bg-[#1077A6]/5 shadow-sm hover:shadow-xl hover:shadow-[#1077A6]/10 transition-all duration-300">
                    <Image
                      src={item.url}
                      alt={item.label || "Gallery image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-[#1a1550]/0 group-hover:bg-[#1a1550]/30 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1550]/60 via-transparent to-transparent" />
                    {item.label && (
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-[11px] font-semibold leading-snug line-clamp-2">
                          {item.label}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-[#1077A6]/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {prevTribe ? (
              <Link
                href={`/tribes/${prevTribe.id}`}
                className="group inline-flex items-center gap-2.5 text-[#1a1550]/45 hover:text-[#1077A6] transition-colors text-[14px] font-semibold"
              >
                <span className="w-8 h-8 rounded-full border border-[#1077A6]/15 group-hover:border-[#1077A6]/40 group-hover:bg-[#1077A6]/5 flex items-center justify-center transition-all">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                </span>
                <span>
                  <span className="block text-[10px] text-[#1a1550]/30 uppercase tracking-wider font-semibold mb-0.5">
                    Previous
                  </span>
                  {prevTribe.name}
                </span>
              </Link>
            ) : (
              <Link
                href="/tribes"
                className="group inline-flex items-center gap-2.5 text-[#1a1550]/45 hover:text-[#1077A6] transition-colors text-[14px] font-semibold"
              >
                <span className="w-8 h-8 rounded-full border border-[#1077A6]/15 group-hover:border-[#1077A6]/40 group-hover:bg-[#1077A6]/5 flex items-center justify-center transition-all">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                </span>
                All Tribes
              </Link>
            )}

            {nextTribe && (
              <Link
                href={`/tribes/${nextTribe.id}`}
                className="group inline-flex items-center gap-2.5 text-[#1a1550]/45 hover:text-[#1077A6] transition-colors text-[14px] font-semibold text-right"
              >
                <span>
                  <span className="block text-[10px] text-[#1a1550]/30 uppercase tracking-wider font-semibold mb-0.5">
                    Next
                  </span>
                  {nextTribe.name}
                </span>
                <span className="w-8 h-8 rounded-full border border-[#1077A6]/15 group-hover:border-[#1077A6]/40 group-hover:bg-[#1077A6]/5 flex items-center justify-center transition-all">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightboxIdx !== null && gallery[lightboxIdx] && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0814]/92 backdrop-blur-md p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {gallery.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-3 md:left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-[#f4c430]/20 border border-white/15 hover:border-[#f4c430]/40 flex items-center justify-center text-white hover:text-[#f4c430] transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl w-full max-h-[82vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                style={{ maxHeight: "75vh" }}
              >
                <Image
                  src={gallery[lightboxIdx].url}
                  alt={gallery[lightboxIdx].label || "Gallery image"}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain max-h-[75vh]"
                  unoptimized
                />
              </div>
              {gallery[lightboxIdx].label && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-4 text-center"
                >
                  <p className="text-white/75 text-[13px] font-medium">
                    {gallery[lightboxIdx].label}
                  </p>
                  <p className="text-white/30 text-[11px] mt-1">
                    {lightboxIdx + 1} / {gallery.length}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {gallery.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-3 md:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-[#f4c430]/20 border border-white/15 hover:border-[#f4c430]/40 flex items-center justify-center text-white hover:text-[#f4c430] transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {gallery.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
                {gallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIdx(idx);
                    }}
                    className={`rounded-full transition-all duration-200 ${
                      idx === lightboxIdx
                        ? "w-5 h-2 bg-[#f4c430]"
                        : "w-2 h-2 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
