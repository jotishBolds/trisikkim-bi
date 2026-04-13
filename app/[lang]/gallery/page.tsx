"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Images,
  Play,
  Video,
  ImageIcon,
  ArrowLeft,
  Camera,
  Folder,
  ExternalLink,
  Clock,
  Film,
  LayoutGrid,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/use-translation";
import PageHero from "@/components/PageHero";
import {
  extractYouTubeId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
} from "@/lib/youtube";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  sortOrder: number;
  translations?: { hi?: { alt?: string; caption?: string } } | null;
}

interface GallerySection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  images: GalleryImage[];
  translations?: { hi?: { label?: string; description?: string } } | null;
}

interface VideoCategory {
  id: number;
  slug: string;
  label: string;
  description: string | null;
  sortOrder: number;
  active: boolean;
  translations?: { hi?: { label?: string; description?: string } } | null;
}

interface GalleryVideoItem {
  id: number;
  categoryId: number | null;
  title: string;
  youtubeUrl: string;
  description: string | null;
  sortOrder: number;
  active: boolean;
  publishedAt: string;
  translations?: { hi?: { title?: string; description?: string } } | null;
}

const EASE_OUT_QUART: [number, number, number, number] = [
  0.25, 0.46, 0.45, 0.94,
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.5,
      ease: EASE_OUT_QUART,
    },
  }),
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.04, duration: 0.4, ease: EASE_OUT_QUART },
  }),
};

const overlayV = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalV = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_QUART },
  },
};

function t(dict: Record<string, any>, key: string, fallback: string): string {
  const val = dict?.gallery?.[key];
  return typeof val === "string" ? val : fallback;
}

function getLabel(s: GallerySection, lang: string) {
  return (lang !== "en" && s.translations?.hi?.label) || s.name;
}
function getDesc(s: GallerySection, lang: string) {
  return (lang !== "en" && s.translations?.hi?.description) || s.description;
}
function getAlt(img: GalleryImage, lang: string) {
  return (lang !== "en" && img.translations?.hi?.alt) || img.alt;
}
function getVideoTitle(v: GalleryVideoItem, lang: string) {
  return (lang !== "en" && v.translations?.hi?.title) || v.title;
}
function getVideoDesc(v: GalleryVideoItem, lang: string) {
  return (lang !== "en" && v.translations?.hi?.description) || v.description;
}
function getVideoCatLabel(c: VideoCategory, lang: string) {
  return (lang !== "en" && c.translations?.hi?.label) || c.label;
}
function getVideoCatDesc(c: VideoCategory, lang: string) {
  return (lang !== "en" && c.translations?.hi?.description) || c.description;
}

function getSafeYouTubeThumbnail(url: string): string {
  try {
    const id = extractYouTubeId(url);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  } catch {}
  try {
    return getYouTubeThumbnail(url);
  } catch {}
  return "/placeholder-video.jpg";
}

function getSafeEmbedUrl(url: string): string | null {
  try {
    const id = extractYouTubeId(url);
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  } catch {}
  try {
    return getYouTubeEmbedUrl(url);
  } catch {}
  return null;
}

function formatDate(dateStr: string, lang: string) {
  try {
    return new Date(dateStr).toLocaleDateString(
      lang === "hi" ? "hi-IN" : "en-IN",
      { year: "numeric", month: "short", day: "numeric" },
    );
  } catch {
    return "";
  }
}

function timeAgo(dateStr: string, lang: string) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return lang === "hi" ? "आज" : "Today";
    if (days < 30) return lang === "hi" ? `${days} दिन पहले` : `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12)
      return lang === "hi" ? `${months} महीने पहले` : `${months}mo ago`;
    const years = Math.floor(months / 12);
    return lang === "hi" ? `${years} साल पहले` : `${years}y ago`;
  } catch {
    return "";
  }
}

export default function GalleryPage() {
  const { lang, dict } = useTranslation();

  const [mode, setMode] = useState<"photo" | "video">("photo");
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [videos, setVideos] = useState<GalleryVideoItem[]>([]);
  const [videoCategories, setVideoCategories] = useState<VideoCategory[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [activeSlug, setActiveSlug] = useState("all");
  const [activeVideoCat, setActiveVideoCat] = useState<string>("all");
  const [lightbox, setLightbox] = useState<{
    si: number;
    ii: number;
  } | null>(null);
  const [activeVideo, setActiveVideo] = useState<GalleryVideoItem | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSections(d.data);
      })
      .catch(console.error)
      .finally(() => setLoadingPhotos(false));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/gallery/videos")
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.data)) setVideos(d.data);
        }),
      fetch("/api/gallery/video-categories")
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.data)) setVideoCategories(d.data);
        }),
    ])
      .catch(console.error)
      .finally(() => setLoadingVideos(false));
  }, []);

  const openLB = (si: number, ii: number) => setLightbox({ si, ii });
  const closeLB = useCallback(() => setLightbox(null), []);
  const navLB = useCallback(
    (dir: 1 | -1) => {
      if (!lightbox) return;
      const len = sections[lightbox.si].images.length;
      setLightbox({
        si: lightbox.si,
        ii: (lightbox.ii + dir + len) % len,
      });
    },
    [lightbox, sections],
  );

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLB();
        setActiveVideo(null);
      }
      if (lightbox && e.key === "ArrowRight") navLB(1);
      if (lightbox && e.key === "ArrowLeft") navLB(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightbox, closeLB, navLB]);

  useEffect(() => {
    document.body.style.overflow = lightbox || activeVideo ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox, activeVideo]);

  const curImg = lightbox ? sections[lightbox.si]?.images[lightbox.ii] : null;
  const totalPhotos = sections.reduce((a, s) => a + s.images.length, 0);

  const filteredVideos =
    activeVideoCat === "all"
      ? videos
      : activeVideoCat === "uncategorized"
        ? videos.filter((v) => !v.categoryId)
        : videos.filter((v) => {
            const cat = videoCategories.find((c) => c.slug === activeVideoCat);
            return cat ? v.categoryId === cat.id : false;
          });

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      <PageHero
        badge={t(dict, "subtitle", "Gallery")}
        title={t(dict, "title", "Photo & Video Gallery")}
        icon={<Images className="w-3.5 h-3.5 text-[#f4c430]" />}
      />

      <div className="sticky top-[var(--navbar-height,0)] z-30 bg-white/95 backdrop-blur-md border-b border-[#1077A6]/8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 pt-3 pb-1.5">
            <ModeBtn
              active={mode === "photo"}
              onClick={() => {
                setMode("photo");
                setActiveSlug("all");
              }}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{t(dict, "photoGallery", "Photos")}</span>
              {totalPhotos > 0 && (
                <CountBadge n={totalPhotos} active={mode === "photo"} />
              )}
            </ModeBtn>
            <ModeBtn
              active={mode === "video"}
              onClick={() => {
                setMode("video");
                setActiveVideoCat("all");
              }}
            >
              <Video className="w-4 h-4" />
              <span>{t(dict, "videoGallery", "Videos")}</span>
              {videos.length > 0 && (
                <CountBadge n={videos.length} active={mode === "video"} />
              )}
            </ModeBtn>
          </div>

          {mode === "photo" && sections.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 scrollbar-hide -mx-1 px-1">
              <NavChip
                active={activeSlug === "all"}
                onClick={() => setActiveSlug("all")}
              >
                <Folder className="w-3 h-3" />
                {t(dict, "allSections", "All Albums")}
              </NavChip>
              {sections.map((s) => {
                const lbl = getLabel(s, lang);
                return (
                  <NavChip
                    key={s.id}
                    active={activeSlug === s.slug}
                    onClick={() => setActiveSlug(s.slug)}
                  >
                    {lbl.length > 24 ? lbl.slice(0, 24) + "…" : lbl}
                    <span className="text-[10px] opacity-60 ml-1">
                      {s.images.length}
                    </span>
                  </NavChip>
                );
              })}
            </div>
          )}

          {mode === "video" && !loadingVideos && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 scrollbar-hide -mx-1 px-1">
              <NavChip
                active={activeVideoCat === "all"}
                onClick={() => setActiveVideoCat("all")}
                variant="video"
              >
                <Film className="w-3 h-3" />
                {t(dict, "allVideos", "All Videos")}
                <span className="text-[10px] opacity-60 ml-1">
                  {videos.length}
                </span>
              </NavChip>

              {videoCategories.map((cat) => {
                const count = videos.filter(
                  (v) => v.categoryId === cat.id,
                ).length;
                const lbl = getVideoCatLabel(cat, lang);
                return (
                  <NavChip
                    key={cat.id}
                    active={activeVideoCat === cat.slug}
                    onClick={() => setActiveVideoCat(cat.slug)}
                    variant="video"
                  >
                    {lbl.length > 24 ? lbl.slice(0, 24) + "…" : lbl}
                    <span className="text-[10px] opacity-60 ml-1">{count}</span>
                  </NavChip>
                );
              })}

              {videos.some((v) => !v.categoryId) && (
                <NavChip
                  active={activeVideoCat === "uncategorized"}
                  onClick={() => setActiveVideoCat("uncategorized")}
                  variant="video"
                >
                  <Tag className="w-3 h-3" />
                  General
                  <span className="text-[10px] opacity-60 ml-1">
                    {videos.filter((v) => !v.categoryId).length}
                  </span>
                </NavChip>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <AnimatePresence mode="wait">
          {mode === "photo" ? (
            <motion.div
              key="photo"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {loadingPhotos ? (
                <Loader text={t(dict, "loading", "Loading gallery…")} />
              ) : sections.length === 0 ? (
                <Empty
                  icon={<Camera className="w-12 h-12" />}
                  text={t(dict, "noPhotos", "No photos yet.")}
                />
              ) : activeSlug === "all" ? (
                <AlbumGrid
                  sections={sections}
                  lang={lang}
                  dict={dict}
                  onSelect={setActiveSlug}
                />
              ) : (
                (() => {
                  const sec = sections.find((s) => s.slug === activeSlug);
                  if (!sec) return null;
                  const si = sections.indexOf(sec);
                  return (
                    <AlbumDetail
                      section={sec}
                      si={si}
                      lang={lang}
                      dict={dict}
                      onOpen={openLB}
                      onBack={() => setActiveSlug("all")}
                    />
                  );
                })()
              )}
            </motion.div>
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {loadingVideos ? (
                <Loader text={t(dict, "loading", "Loading videos…")} />
              ) : videos.length === 0 ? (
                <VideoEmptyState dict={dict} />
              ) : activeVideoCat === "all" ? (
                <VideoCategoryOverview
                  videos={videos}
                  videoCategories={videoCategories}
                  lang={lang}
                  dict={dict}
                  onPlay={setActiveVideo}
                  onSelectCategory={setActiveVideoCat}
                />
              ) : (
                <VideoCategoryDetail
                  videos={filteredVideos}
                  category={
                    activeVideoCat === "uncategorized"
                      ? null
                      : videoCategories.find(
                          (c) => c.slug === activeVideoCat,
                        ) || null
                  }
                  isUncategorized={activeVideoCat === "uncategorized"}
                  lang={lang}
                  dict={dict}
                  onPlay={setActiveVideo}
                  onBack={() => setActiveVideoCat("all")}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightbox && curImg && (
          <motion.div
            variants={overlayV}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm"
            onClick={closeLB}
          >
            <button
              onClick={closeLB}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white border border-white/15 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 border border-white/10 text-white text-[11px] px-3 py-1 rounded-full font-mono tracking-wider">
              {lightbox.ii + 1} / {sections[lightbox.si].images.length}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navLB(-1);
              }}
              className="absolute left-2 sm:left-4 md:left-8 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white border border-white/15 transition"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${lightbox.si}-${lightbox.ii}`}
                variants={modalV}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative max-w-4xl w-full h-[65vh] sm:h-[75vh] md:h-[80vh] mx-14 sm:mx-16 md:mx-20 rounded-2xl overflow-hidden shadow-2xl bg-black"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={curImg.src}
                  alt={getAlt(curImg, lang)}
                  fill
                  className="object-contain"
                  unoptimized
                />
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-5">
                  <p className="text-white font-semibold text-sm">
                    {getLabel(sections[lightbox.si], lang)}
                  </p>
                  <p className="text-white/55 text-xs mt-0.5">
                    {getAlt(curImg, lang)}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navLB(1);
              }}
              className="absolute right-2 sm:right-4 md:right-8 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white border border-white/15 transition"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            video={activeVideo}
            lang={lang}
            dict={dict}
            categoryName={
              activeVideo.categoryId
                ? videoCategories.find(
                    (c) => c.id === activeVideo.categoryId,
                  ) || null
                : null
            }
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ModeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 whitespace-nowrap",
        active
          ? "bg-[#1077A6] text-white shadow-md shadow-[#1077A6]/25"
          : "bg-[#f4f3fb] text-[#1a1550]/50 hover:bg-[#1077A6]/10 hover:text-[#1077A6]",
      )}
    >
      {children}
    </button>
  );
}

function CountBadge({ n, active }: { n: number; active: boolean }) {
  return (
    <span
      className={cn(
        "text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5",
        active ? "bg-white/20 text-white" : "bg-[#1077A6]/10 text-[#1077A6]",
      )}
    >
      {n}
    </span>
  );
}

function NavChip({
  active,
  onClick,
  children,
  variant = "photo",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "photo" | "video";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 whitespace-nowrap",
        active
          ? variant === "video"
            ? "bg-linear-to-r from-[#1077A6] to-[#0d5f85] text-white shadow-sm shadow-[#1077A6]/20"
            : "bg-[#1077A6] text-white shadow-sm"
          : "bg-[#f4f3fb] text-[#1a1550]/55 hover:bg-[#1077A6]/10 hover:text-[#1077A6]",
      )}
    >
      {children}
    </button>
  );
}

function Loader({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-3">
      <div className="w-8 h-8 border-2 border-[#1077A6]/20 border-t-[#1077A6] rounded-full animate-spin" />
      <p className="text-[#1a1550]/40 text-sm">{text}</p>
    </div>
  );
}

function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-3 text-[#1a1550]/25">
      {icon}
      <p className="text-sm">{text}</p>
    </div>
  );
}

function SectionDivider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="h-px flex-1 bg-linear-to-r from-[#1077A6]/15 to-transparent" />
      <span className="text-[#1a1550]/35 text-xs font-semibold uppercase tracking-widest">
        {text}
      </span>
      <div className="h-px flex-1 bg-linear-to-l from-[#1077A6]/15 to-transparent" />
    </div>
  );
}

function YTIcon() {
  return (
    <svg viewBox="0 0 28 20" className="w-3 h-2" fill="white">
      <path d="M27.4 3.1s-.3-1.8-1.1-2.6C25 .1 23.5 0 22.8 0H5.2C4.5 0 3 .1 1.7.5.9 1.3.6 3.1.6 3.1S.3 5.2.3 7.3v2c0 2.1.3 4.2.3 4.2s.3 1.8 1.1 2.6c1.3.4 2.8.5 3.5.5h17.6c.7 0 2.2-.1 3.5-.5.8-.8 1.1-2.6 1.1-2.6s.3-2.1.3-4.2v-2c0-2.1-.3-4.2-.3-4.2zM11 13.2V4.5l7.5 4.4-7.5 4.3z" />
    </svg>
  );
}

function VideoEmptyState({ dict }: { dict: Record<string, any> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-5"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#1077A6]/10 to-[#1077A6]/5 grid place-items-center">
          <Video className="w-9 h-9 text-[#1077A6]/40" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#1A3A6B]/15 grid place-items-center">
          <Play className="w-3 h-3 text-[#1A3A6B]" fill="#1A3A6B" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-[#1a1550]/50 font-semibold text-base">
          {t(dict, "noVideos", "No videos available yet")}
        </p>
        <p className="text-[#1a1550]/30 text-sm mt-1">
          Check back soon for new content
        </p>
      </div>
    </motion.div>
  );
}

function AlbumGrid({
  sections,
  lang,
  dict,
  onSelect,
}: {
  sections: GallerySection[];
  lang: string;
  dict: Record<string, any>;
  onSelect: (slug: string) => void;
}) {
  const total = sections.reduce((a, s) => a + s.images.length, 0);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-[#1a1550]/45 text-sm mb-8"
      >
        <Camera className="w-4 h-4 text-[#1077A6]" />
        <span>
          {sections.length} Albums &bull; {total} {t(dict, "photos", "Photos")}
        </span>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {sections.map((section, i) => (
          <motion.div
            key={section.id}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="group relative aspect-[4/3] sm:aspect-[3/2] rounded-2xl overflow-hidden cursor-pointer bg-[#1077A6]/5 border border-[#1077A6]/10 hover:border-[#f4c430]/50 shadow-sm hover:shadow-2xl transition-all duration-500"
            onClick={() => onSelect(section.slug)}
          >
            {section.images[0] && (
              <Image
                src={section.images[0].src}
                alt={getLabel(section, lang)}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                unoptimized
                sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/5 group-hover:from-black/80 transition-all duration-500" />

            {section.images.length > 1 && (
              <div className="absolute top-3 left-3 hidden sm:flex -space-x-1.5">
                {section.images.slice(1, 4).map((img) => (
                  <div
                    key={img.id}
                    className="w-7 h-7 rounded-full border-2 border-white/40 overflow-hidden shadow-sm"
                  >
                    <Image
                      src={img.src}
                      alt=""
                      width={28}
                      height={28}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                ))}
                {section.images.length > 4 && (
                  <div className="w-7 h-7 rounded-full border-2 border-white/40 bg-black/50 backdrop-blur-sm grid place-items-center text-[9px] text-white font-bold">
                    +{section.images.length - 4}
                  </div>
                )}
              </div>
            )}

            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm grid place-items-center opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>

            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
              <h3 className="text-white font-display font-bold text-lg sm:text-xl leading-tight drop-shadow-sm">
                {getLabel(section, lang)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Camera className="w-3.5 h-3.5 text-[#f4c430]" />
                <span className="text-white/70 text-xs font-medium">
                  {section.images.length} {t(dict, "photos", "Photos")}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AlbumDetail({
  section,
  si,
  lang,
  dict,
  onOpen,
  onBack,
}: {
  section: GallerySection;
  si: number;
  lang: string;
  dict: Record<string, any>;
  onOpen: (si: number, ii: number) => void;
  onBack: () => void;
}) {
  const name = getLabel(section, lang);
  const desc = getDesc(section, lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <button
          onClick={onBack}
          className="group/back flex items-center gap-1.5 text-[#1077A6] text-sm font-medium mb-5 hover:gap-2.5 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-0.5 transition-transform" />
          All Albums
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#1077A6]/15 to-[#1077A6]/5 grid place-items-center shrink-0 mt-0.5">
            <Images className="w-5 h-5 text-[#1077A6]" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-[#1a1550] text-xl sm:text-2xl md:text-3xl leading-tight">
              {name}
            </h2>
            <p className="text-[#1a1550]/40 text-sm mt-0.5">
              {section.images.length} {t(dict, "photos", "Photos")}
            </p>
            {desc && (
              <p className="text-[#1a1550]/50 text-sm mt-2 max-w-2xl leading-relaxed">
                {desc}
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[140px] sm:auto-rows-[170px] md:auto-rows-[200px] lg:auto-rows-[220px] gap-2 sm:gap-2.5 md:gap-3"
        style={{ gridAutoFlow: "dense" }}
      >
        {section.images.map((img, i) => {
          const featured = i === 0 && section.images.length > 2;
          return (
            <motion.div
              key={img.id}
              custom={i}
              variants={scaleUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-20px" }}
              className={cn(
                "group relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer",
                "bg-[#1077A6]/5 border border-[#1077A6]/8",
                "hover:border-[#f4c430]/50 hover:shadow-xl",
                "transition-all duration-300",
                featured && "col-span-2 row-span-2",
              )}
              onClick={() => onOpen(si, i)}
            >
              <Image
                src={img.src}
                alt={getAlt(img, lang)}
                fill
                className="object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                unoptimized
                sizes={
                  featured
                    ? "(max-width:768px) 100vw,50vw"
                    : "(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
                }
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-[11px] sm:text-xs font-medium truncate">
                  {getAlt(img, lang)}
                </p>
              </div>
              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-sm grid place-items-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              {featured && (
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#f4c430] text-[#1a1550] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Featured
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function VideoCategoryOverview({
  videos,
  videoCategories,
  lang,
  dict,
  onPlay,
  onSelectCategory,
}: {
  videos: GalleryVideoItem[];
  videoCategories: VideoCategory[];
  lang: string;
  dict: Record<string, any>;
  onPlay: (v: GalleryVideoItem) => void;
  onSelectCategory: (slug: string) => void;
}) {
  const uncategorized = videos.filter((v) => !v.categoryId);
  const hasCategories = videoCategories.length > 0;

  if (!hasCategories) {
    return (
      <FlatVideoGrid videos={videos} lang={lang} dict={dict} onPlay={onPlay} />
    );
  }

  const activeCats = videoCategories.filter((cat) =>
    videos.some((v) => v.categoryId === cat.id),
  );

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#1077A6] to-[#0d5f85] grid place-items-center shrink-0 shadow-lg shadow-[#1077A6]/25">
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[#1a1550] text-2xl sm:text-3xl leading-tight">
                {t(dict, "videoGallery", "Video Gallery")}
              </h2>
              <p className="text-[#1a1550]/40 text-sm mt-1">
                Browse our curated video collections
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#1077A6]/[0.06] border border-[#1077A6]/10 px-3 py-1.5 rounded-xl">
              <Film className="w-3.5 h-3.5 text-[#1077A6]" />
              <span className="text-[#1a1550] text-xs font-semibold">
                {videos.length}
              </span>
              <span className="text-[#1a1550]/40 text-xs">
                {t(dict, "videosCount", "Videos")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1A3A6B]/[0.06] border border-[#1A3A6B]/10 px-3 py-1.5 rounded-xl">
              <LayoutGrid className="w-3.5 h-3.5 text-[#1A3A6B]" />
              <span className="text-[#1a1550] text-xs font-semibold">
                {activeCats.length + (uncategorized.length > 0 ? 1 : 0)}
              </span>
              <span className="text-[#1a1550]/40 text-xs">Collections</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeCats.map((cat, idx) => {
            const catVideos = videos.filter((v) => v.categoryId === cat.id);
            const catLabel = getVideoCatLabel(cat, lang);
            const catDesc = getVideoCatDesc(cat, lang);

            return (
              <motion.div
                key={cat.id}
                custom={idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                className="group cursor-pointer"
                onClick={() => onSelectCategory(cat.slug)}
              >
                <div className="relative rounded-2xl overflow-hidden ring-1 ring-[#1077A6]/10 border-2 border-transparent hover:border-[#f4c430]/40 shadow-md hover:shadow-2xl transition-all duration-500">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {catVideos.length >= 3 ? (
                      <div className="grid grid-cols-3 h-full gap-[2px]">
                        <div className="relative col-span-2">
                          <Image
                            src={getSafeYouTubeThumbnail(
                              catVideos[0].youtubeUrl,
                            )}
                            alt=""
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            unoptimized
                          />
                        </div>
                        <div className="flex flex-col gap-[2px]">
                          <div className="relative flex-1">
                            <Image
                              src={getSafeYouTubeThumbnail(
                                catVideos[1].youtubeUrl,
                              )}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="relative flex-1">
                            <Image
                              src={getSafeYouTubeThumbnail(
                                catVideos[2].youtubeUrl,
                              )}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            {catVideos.length > 3 && (
                              <div className="absolute inset-0 bg-black/60 grid place-items-center">
                                <span className="text-white font-bold text-sm">
                                  +{catVideos.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : catVideos.length === 2 ? (
                      <div className="grid grid-cols-2 h-full gap-[2px]">
                        <div className="relative">
                          <Image
                            src={getSafeYouTubeThumbnail(
                              catVideos[0].youtubeUrl,
                            )}
                            alt=""
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            unoptimized
                          />
                        </div>
                        <div className="relative">
                          <Image
                            src={getSafeYouTubeThumbnail(
                              catVideos[1].youtubeUrl,
                            )}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={getSafeYouTubeThumbnail(catVideos[0].youtubeUrl)}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute inset-0 grid place-items-center">
                      <div className="w-11 h-11 rounded-full bg-white/95 grid place-items-center shadow-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                        <Play
                          className="w-5 h-5 text-[#1a1550] ml-0.5"
                          fill="#1a1550"
                        />
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                      <Film className="w-3 h-3" />
                      {catVideos.length}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-display font-bold text-lg sm:text-xl leading-tight drop-shadow-lg line-clamp-2">
                        {catLabel}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-[#1077A6] shrink-0" />
                        <span className="text-[#1a1550] text-sm font-semibold truncate">
                          {catLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#1077A6] opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                        <span className="text-[11px] font-semibold">
                          View All
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    {catDesc && (
                      <p className="text-[#1a1550]/40 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {catDesc}
                      </p>
                    )}

                    <div className="mt-3 space-y-1">
                      {catVideos.slice(0, 2).map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center gap-2 text-[11px] text-[#1a1550]/50"
                        >
                          <Play
                            className="w-2.5 h-2.5 shrink-0 text-[#1077A6]"
                            fill="#1077A6"
                          />
                          <span className="truncate">
                            {getVideoTitle(v, lang)}
                          </span>
                        </div>
                      ))}
                      {catVideos.length > 2 && (
                        <span className="text-[10px] text-[#1077A6]/60 font-medium pl-4">
                          +{catVideos.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {uncategorized.length > 0 && (
            <motion.div
              custom={activeCats.length}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => onSelectCategory("uncategorized")}
            >
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-[#1a1550]/10 border-2 border-transparent hover:border-[#f4c430]/40 shadow-md hover:shadow-2xl transition-all duration-500">
                <div className="relative aspect-[16/9] overflow-hidden bg-linear-to-br from-[#1a1550]/5 to-[#1077A6]/10">
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                    {uncategorized.slice(0, 4).map((v) => (
                      <div key={v.id} className="relative">
                        <Image
                          src={getSafeYouTubeThumbnail(v.youtubeUrl)}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-white via-white/70 to-white/30" />

                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-2xl bg-[#1077A6]/10 grid place-items-center mx-auto mb-2 group-hover:bg-[#1077A6]/15 transition-colors">
                        <Tag className="w-6 h-6 text-[#1077A6]" />
                      </div>
                      <span className="text-[#1a1550] font-bold text-lg">
                        {uncategorized.length}
                      </span>
                      <p className="text-[#1a1550]/40 text-xs">
                        General Videos
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 bg-[#1077A6]/10 backdrop-blur-md text-[#1077A6] text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <Film className="w-3 h-3" />
                    {uncategorized.length}
                  </div>
                </div>

                <div className="bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#1a1550]/30 shrink-0" />
                      <span className="text-[#1a1550] text-sm font-semibold">
                        General Videos
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#1077A6] opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                      <span className="text-[11px] font-semibold">
                        View All
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {uncategorized.slice(0, 2).map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center gap-2 text-[11px] text-[#1a1550]/50"
                      >
                        <Play className="w-2.5 h-2.5 shrink-0 text-[#1077A6]" />
                        <span className="truncate">
                          {getVideoTitle(v, lang)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {videos.length > 0 && (
        <div>
          <SectionDivider text="Latest Videos" />
          <FeaturedVideoCard
            video={videos[0]}
            lang={lang}
            dict={dict}
            onPlay={onPlay}
            categoryLabel={
              videos[0].categoryId
                ? videoCategories.find((c) => c.id === videos[0].categoryId) ||
                  null
                : null
            }
          />
          {videos.length > 1 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-6"
            >
              {videos.slice(1, 4).map((video) => (
                <motion.div key={video.id} variants={staggerItem}>
                  <VideoCard
                    video={video}
                    lang={lang}
                    dict={dict}
                    onPlay={onPlay}
                    categoryLabel={
                      video.categoryId
                        ? videoCategories.find(
                            (c) => c.id === video.categoryId,
                          ) || null
                        : null
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

function VideoCategoryDetail({
  videos,
  category,
  isUncategorized,
  lang,
  dict,
  onPlay,
  onBack,
}: {
  videos: GalleryVideoItem[];
  category: VideoCategory | null;
  isUncategorized: boolean;
  lang: string;
  dict: Record<string, any>;
  onPlay: (v: GalleryVideoItem) => void;
  onBack: () => void;
}) {
  const catName = category
    ? getVideoCatLabel(category, lang)
    : "General Videos";
  const catDesc = category ? getVideoCatDesc(category, lang) : null;

  const featured = videos[0];
  const rest = videos.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <button
        onClick={onBack}
        className="group/back flex items-center gap-1.5 text-[#1077A6] text-sm font-medium hover:gap-2.5 transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-0.5 transition-transform" />
        {t(dict, "allVideos", "All Videos")}
      </button>

      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          {featured && (
            <Image
              src={getSafeYouTubeThumbnail(featured.youtubeUrl)}
              alt=""
              fill
              className="object-cover blur-md scale-110 opacity-30"
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-linear-to-r from-[#1a1550] via-[#1a1550]/95 to-[#1a1550]/80" />
        </div>

        <div className="relative px-5 sm:px-8 py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-[#1077A6] to-[#0d5f85] grid place-items-center shrink-0 shadow-xl">
            <Film className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="bg-white/15 text-white/80 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-sm">
                {isUncategorized ? "General" : "Collection"}
              </span>
            </div>
            <h2 className="font-display font-bold text-white text-xl sm:text-2xl md:text-3xl leading-tight">
              {catName}
            </h2>
            {catDesc && (
              <p className="text-white/45 text-sm mt-2 max-w-2xl leading-relaxed">
                {catDesc}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-white font-bold text-xl">{videos.length}</div>
            <div className="text-white/50 text-[10px] font-medium uppercase tracking-wider">
              {t(dict, "videosCount", "Videos")}
            </div>
          </div>
        </div>
      </div>

      {videos.length === 0 ? (
        <Empty
          icon={<Video className="w-12 h-12" />}
          text="No videos in this category."
        />
      ) : (
        <>
          {featured && (
            <FeaturedVideoCard
              video={featured}
              lang={lang}
              dict={dict}
              onPlay={onPlay}
              categoryLabel={category}
            />
          )}
          {rest.length > 0 && (
            <div>
              <SectionDivider text="More Videos" />
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
              >
                {rest.map((video) => (
                  <motion.div key={video.id} variants={staggerItem}>
                    <VideoCard
                      video={video}
                      lang={lang}
                      dict={dict}
                      onPlay={onPlay}
                      categoryLabel={category}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

function FlatVideoGrid({
  videos,
  lang,
  dict,
  onPlay,
}: {
  videos: GalleryVideoItem[];
  lang: string;
  dict: Record<string, any>;
  onPlay: (v: GalleryVideoItem) => void;
}) {
  const featured = videos[0];
  const rest = videos.slice(1);

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#1077A6] to-[#0d5f85] grid place-items-center shrink-0 shadow-lg shadow-[#1077A6]/25">
          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-[#1a1550] text-xl sm:text-2xl leading-tight">
            {t(dict, "videoGallery", "Video Gallery")}
          </h2>
          <p className="text-[#1a1550]/40 text-sm mt-0.5">
            {videos.length} {t(dict, "videosCount", "Videos")}
          </p>
        </div>
      </motion.div>

      {featured && (
        <FeaturedVideoCard
          video={featured}
          lang={lang}
          dict={dict}
          onPlay={onPlay}
          categoryLabel={null}
        />
      )}

      {rest.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {rest.map((video) => (
            <motion.div key={video.id} variants={staggerItem}>
              <VideoCard
                video={video}
                lang={lang}
                dict={dict}
                onPlay={onPlay}
                categoryLabel={null}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function FeaturedVideoCard({
  video,
  lang,
  dict,
  onPlay,
  categoryLabel,
}: {
  video: GalleryVideoItem;
  lang: string;
  dict: Record<string, any>;
  onPlay: (v: GalleryVideoItem) => void;
  categoryLabel: VideoCategory | null;
}) {
  const title = getVideoTitle(video, lang);
  const desc = getVideoDesc(video, lang);
  const thumb = getSafeYouTubeThumbnail(video.youtubeUrl);

  return (
    <div
      className="group relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer bg-[#0a0a1a] border border-[#1077A6]/15 hover:border-[#f4c430]/40 shadow-lg hover:shadow-2xl hover:shadow-[#1077A6]/10 transition-all duration-500"
      onClick={() => onPlay(video)}
    >
      <div className="flex flex-col lg:flex-row">
        <div className="relative aspect-video lg:aspect-auto lg:w-[60%] overflow-hidden">
          <Image
            src={thumb}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            unoptimized
            sizes="(max-width:1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#0a0a1a]/90 hidden lg:block" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a1a] via-transparent to-transparent lg:hidden" />

          <div className="absolute inset-0 grid place-items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#f4c430]/30 animate-ping" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f4c430] grid place-items-center shadow-xl shadow-[#f4c430]/30 group-hover:scale-110 transition-transform duration-300">
                <Play
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#1a1550] ml-1"
                  fill="#1a1550"
                />
              </div>
            </div>
          </div>

          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#f4c430] text-[#1a1550] text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
              <Play className="w-3 h-3" fill="#1a1550" />
              Featured
            </div>
            {categoryLabel && (
              <div className="bg-[#1077A6]/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg shadow-sm">
                {getVideoCatLabel(categoryLabel, lang)}
              </div>
            )}
          </div>

          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
            <YTIcon />
            YouTube
          </div>
        </div>

        <div className="relative lg:w-[40%] p-5 sm:p-6 lg:p-8 flex flex-col justify-center bg-linear-to-br from-[#0a0a1a] via-[#0f1535] to-[#0a0a1a]">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04] hidden lg:block">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #f4c430 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            />
          </div>

          <div className="relative z-10">
            {categoryLabel && (
              <div className="flex items-center gap-1.5 mb-3">
                <Tag className="w-3 h-3 text-[#f4c430]" />
                <span className="text-[#f4c430]/70 text-xs font-semibold">
                  {getVideoCatLabel(categoryLabel, lang)}
                </span>
              </div>
            )}

            <h3 className="font-display font-bold text-white text-lg sm:text-xl lg:text-2xl leading-tight line-clamp-3">
              {title}
            </h3>

            {desc && (
              <p className="text-white/40 text-sm mt-3 line-clamp-3 leading-relaxed">
                {desc}
              </p>
            )}

            {video.publishedAt && (
              <div className="flex items-center gap-4 mt-4 text-white/30 text-xs">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(video.publishedAt, lang)}
                </span>
                <span className="text-white/15">&bull;</span>
                <span>{timeAgo(video.publishedAt, lang)}</span>
              </div>
            )}

            <button
              className="mt-5 flex items-center gap-2 bg-[#f4c430] hover:bg-[#e5b525] text-[#1a1550] font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-[#f4c430]/20 hover:shadow-lg hover:shadow-[#f4c430]/30 transition-all duration-300 group/btn"
              onClick={(e) => {
                e.stopPropagation();
                onPlay(video);
              }}
            >
              <Play className="w-4 h-4" fill="#1a1550" />
              Watch Now
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({
  video,
  lang,
  dict,
  onPlay,
  categoryLabel,
}: {
  video: GalleryVideoItem;
  lang: string;
  dict: Record<string, any>;
  onPlay: (v: GalleryVideoItem) => void;
  categoryLabel: VideoCategory | null;
}) {
  const title = getVideoTitle(video, lang);
  const desc = getVideoDesc(video, lang);
  const thumb = getSafeYouTubeThumbnail(video.youtubeUrl);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group cursor-pointer" onClick={() => onPlay(video)}>
      <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-linear-to-br from-[#1077A6]/10 to-[#1077A6]/5 border border-[#1077A6]/10 hover:border-[#f4c430]/40 shadow-sm hover:shadow-xl hover:shadow-[#1077A6]/8 transition-all duration-300">
        {!imgError ? (
          <Image
            src={thumb}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#1077A6]/20 to-[#0d5f85]/30 grid place-items-center">
            <Video className="w-10 h-10 text-[#1077A6]/40" />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute inset-0 grid place-items-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 backdrop-blur-sm grid place-items-center shadow-lg group-hover:bg-[#f4c430] group-hover:scale-110 transition-all duration-300">
            <Play
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#1a1550] ml-0.5"
              fill="#1a1550"
            />
          </div>
        </div>

        {categoryLabel && (
          <div className="absolute top-2.5 left-2.5">
            <div className="bg-[#1077A6]/80 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
              {getVideoCatLabel(categoryLabel, lang)}
            </div>
          </div>
        )}

        <div className="absolute top-2.5 right-2.5">
          <div className="bg-red-600/90 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <YTIcon />
          </div>
        </div>

        {video.publishedAt && (
          <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white/80 text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {timeAgo(video.publishedAt, lang)}
          </div>
        )}
      </div>

      <div className="mt-3 px-0.5">
        <h3 className="font-semibold text-[#1a1550] text-[14px] leading-snug line-clamp-2 group-hover:text-[#1077A6] transition-colors duration-200">
          {title}
        </h3>
        {desc && (
          <p className="text-[#1a1550]/40 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {desc}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          {categoryLabel && (
            <span className="text-[#1077A6] text-[10px] font-semibold bg-[#1077A6]/8 px-1.5 py-0.5 rounded">
              {getVideoCatLabel(categoryLabel, lang)}
            </span>
          )}
          {video.publishedAt && (
            <span className="text-[#1a1550]/25 text-[11px] font-medium">
              {formatDate(video.publishedAt, lang)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoModal({
  video,
  lang,
  dict,
  categoryName,
  onClose,
}: {
  video: GalleryVideoItem;
  lang: string;
  dict: Record<string, any>;
  categoryName: VideoCategory | null;
  onClose: () => void;
}) {
  const title = getVideoTitle(video, lang);
  const desc = getVideoDesc(video, lang);
  const embedUrl = getSafeEmbedUrl(video.youtubeUrl);

  return (
    <motion.div
      variants={overlayV}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md px-3 sm:px-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white border border-white/15 transition-all duration-200 hover:rotate-90"
        aria-label="Close"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <motion.div
        variants={modalV}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-5xl aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/50 bg-black ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-[#1077A6]/20 to-[#0a0a1a]">
            <div className="text-center space-y-3">
              <Video className="w-12 h-12 text-white/30 mx-auto" />
              <p className="text-white/50 text-sm">Unable to load video</p>
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#f4c430] text-sm font-medium hover:underline"
              >
                Open on YouTube
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </motion.div>

      <div
        className="w-full max-w-5xl mt-4 px-1"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
        >
          <div className="hidden sm:grid w-10 h-10 rounded-xl bg-[#f4c430]/15 place-items-center shrink-0">
            <Play className="w-4 h-4 text-[#f4c430] ml-0.5" fill="#f4c430" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-semibold text-sm sm:text-base leading-snug line-clamp-1">
                {title}
              </h3>
              {categoryName && (
                <span className="bg-[#1077A6]/30 text-[#1077A6] text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {getVideoCatLabel(categoryName, lang)}
                </span>
              )}
            </div>
            {desc && (
              <p className="text-white/40 text-xs sm:text-sm mt-0.5 line-clamp-1">
                {desc}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {video.publishedAt && (
              <span className="text-white/25 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(video.publishedAt, lang)}
              </span>
            )}
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/40 hover:text-[#f4c430] text-xs transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">YouTube</span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
