"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/use-translation";
import PageHero from "@/components/PageHero";
import {
  extractYouTubeId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
} from "@/lib/youtube";

/* ─── Types ──────────────────────────────────────────────────────────── */
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

interface VideoGalleryCategory {
  id: number;
  slug: string;
  label: string;
  description: string | null;
  sortOrder: number;
  translations?: { hi?: { label?: string; description?: string } } | null;
}

interface GalleryVideoItem {
  id: number;
  categoryId: number | null;
  title: string;
  youtubeUrl: string;
  description: string | null;
  sortOrder: number;
  publishedAt: string;
  translations?: { hi?: { title?: string; description?: string } } | null;
}

/* ─── Framer variants ────────────────────────────────────────────────── */
const gridItem = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.045, duration: 0.45 },
  }),
};

const lightboxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const lightboxImg = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

/* ═══════════════════════════════════════════════════════════════════════
   GALLERY PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function GalleryPage() {
  const { lang, dict } = useTranslation();

  const [galleryMode, setGalleryMode] = useState<"photo" | "video">("photo");
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [videoCategories, setVideoCategories] = useState<
    VideoGalleryCategory[]
  >([]);
  const [videos, setVideos] = useState<GalleryVideoItem[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("all");
  const [activeVideoCategory, setActiveVideoCategory] = useState<number | null>(
    null,
  );

  const [lightbox, setLightbox] = useState<{
    sectionIdx: number;
    imgIdx: number;
  } | null>(null);

  const [activeVideo, setActiveVideo] = useState<GalleryVideoItem | null>(null);

  /* ── FIX 1: Separated useEffects — photo and video fetches are independent ── */
  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSections(d.data);
      })
      .catch((err) => console.error("Failed to fetch photos:", err))
      .finally(() => setLoadingPhotos(false));
  }, []);

  useEffect(() => {
    fetch("/api/gallery/videos")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setVideos(d.data);
        } else {
          console.error("Videos API returned error:", d.error);
        }
      })
      .catch((err) => console.error("Failed to fetch videos:", err))
      .finally(() => setLoadingVideos(false));
  }, []);

  useEffect(() => {
    fetch("/api/gallery/video-categories")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setVideoCategories(d.data);
        } else {
          console.error("Video categories API returned error:", d.error);
        }
      })
      .catch((err) => console.error("Failed to fetch video categories:", err));
  }, []);

  /* ── lightbox helpers ── */
  const openLightbox = (sectionIdx: number, imgIdx: number) =>
    setLightbox({ sectionIdx, imgIdx });
  const closeLightbox = () => setLightbox(null);

  const lightboxNext = () => {
    if (!lightbox) return;
    const section = sections[lightbox.sectionIdx];
    setLightbox({
      ...lightbox,
      imgIdx: (lightbox.imgIdx + 1) % section.images.length,
    });
  };
  const lightboxPrev = () => {
    if (!lightbox) return;
    const section = sections[lightbox.sectionIdx];
    setLightbox({
      ...lightbox,
      imgIdx:
        (lightbox.imgIdx - 1 + section.images.length) % section.images.length,
    });
  };

  const visibleSections =
    activeSection === "all"
      ? sections
      : sections.filter((s) => s.slug === activeSection);

  const currentLightboxImage = lightbox
    ? sections[lightbox.sectionIdx]?.images[lightbox.imgIdx]
    : null;

  /* ── keyboard nav ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
        setActiveVideo(null);
      }
      if (lightbox) {
        if (e.key === "ArrowRight") lightboxNext();
        if (e.key === "ArrowLeft") lightboxPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox]);

  /* ── lock body scroll when modal open ── */
  useEffect(() => {
    document.body.style.overflow = lightbox || activeVideo ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox, activeVideo]);

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      <PageHero
        badge={dict.gallery?.subtitle ?? "Photo & Video Gallery"}
        title={dict.gallery?.title ?? "Gallery"}
        icon={<Images className="w-3.5 h-3.5 text-[#f4c430]" />}
      />

      {/* ── Toggle + Filter tabs ── */}
      <div className="sticky top-[var(--navbar-height,0)] z-30 bg-white border-b border-[#1077A6]/8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 pt-3 pb-1">
            <ModeToggle
              active={galleryMode === "photo"}
              onClick={() => {
                setGalleryMode("photo");
                setActiveSection("all");
              }}
              icon={<ImageIcon className="w-3.5 h-3.5" />}
            >
              {dict.gallery?.photoGallery ?? "Photo Gallery"}
            </ModeToggle>
            <ModeToggle
              active={galleryMode === "video"}
              onClick={() => setGalleryMode("video")}
              icon={<Video className="w-3.5 h-3.5" />}
            >
              {dict.gallery?.videoGallery ?? "Video Gallery"}
              {videos.length > 0 && (
                <span
                  className={cn(
                    "ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    galleryMode === "video"
                      ? "bg-white/20 text-white"
                      : "bg-[#1077A6]/10 text-[#1077A6]",
                  )}
                >
                  {videos.length}
                </span>
              )}
            </ModeToggle>
          </div>

          {galleryMode === "photo" && (
            <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
              <FilterTab
                active={activeSection === "all"}
                onClick={() => setActiveSection("all")}
              >
                {dict.gallery?.allSections ?? "All Sections"}
              </FilterTab>
              {sections.map((s) => (
                <FilterTab
                  key={s.id}
                  active={activeSection === s.slug}
                  onClick={() => setActiveSection(s.slug)}
                >
                  {(() => {
                    const label =
                      (lang !== "en" && s.translations?.hi?.label) || s.name;
                    return label.length > 28
                      ? label.slice(0, 28) + "\u2026"
                      : label;
                  })()}
                </FilterTab>
              ))}
            </div>
          )}

          {galleryMode === "video" && videoCategories.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
              <FilterTab
                active={activeVideoCategory === null}
                onClick={() => setActiveVideoCategory(null)}
              >
                {dict.gallery?.allVideos ?? "All Videos"}
              </FilterTab>
              {videoCategories.map((cat) => (
                <FilterTab
                  key={cat.id}
                  active={activeVideoCategory === cat.id}
                  onClick={() => setActiveVideoCategory(cat.id)}
                >
                  {(() => {
                    const label =
                      (lang !== "en" && cat.translations?.hi?.label) ||
                      cat.label;
                    return label.length > 28
                      ? label.slice(0, 28) + "\u2026"
                      : label;
                  })()}
                </FilterTab>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <AnimatePresence mode="wait">
          {galleryMode === "photo" ? (
            <motion.div
              key="photo"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-20"
            >
              {loadingPhotos ? (
                <div className="text-center text-[#1a1550]/40 py-20">
                  {dict.gallery?.loading ?? "Loading gallery..."}
                </div>
              ) : visibleSections.length === 0 ? (
                <div className="text-center text-[#1a1550]/40 py-20">
                  {dict.gallery?.noPhotos ?? "No photos available."}
                </div>
              ) : (
                visibleSections.map((section) => {
                  const realIdx = sections.findIndex(
                    (s) => s.id === section.id,
                  );
                  return (
                    <GallerySectionComp
                      key={section.id}
                      section={section}
                      sectionIdx={realIdx}
                      onOpen={openLightbox}
                      lang={lang}
                      dict={dict}
                    />
                  );
                })
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
                <div className="text-center text-[#1a1550]/40 py-20">
                  {dict.gallery?.loading ?? "Loading videos..."}
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center text-[#1a1550]/40 py-20 space-y-3">
                  <Video className="w-10 h-10 mx-auto text-[#1a1550]/15" />
                  <p>{dict.gallery?.noVideos ?? "No videos available yet."}</p>
                </div>
              ) : (
                <VideoGalleryGrid
                  videos={
                    activeVideoCategory === null
                      ? videos
                      : videos.filter(
                          (v) => v.categoryId === activeVideoCategory,
                        )
                  }
                  lang={lang}
                  dict={dict}
                  onPlay={setActiveVideo}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Photo Lightbox ── */}
      <AnimatePresence>
        {lightbox && currentLightboxImage && (
          <motion.div
            variants={lightboxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 border border-white/15"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 border border-white/15 text-white text-[12px] px-3 py-1 rounded-full font-mono tracking-widest">
              {String(lightbox.imgIdx + 1).padStart(2, "0")} /{" "}
              {String(sections[lightbox.sectionIdx].images.length).padStart(
                2,
                "0",
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                lightboxPrev();
              }}
              className="absolute left-4 md:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 border border-white/15"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${lightbox.sectionIdx}-${lightbox.imgIdx}`}
                variants={lightboxImg}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative max-w-4xl w-full max-h-[80vh] aspect-[4/3] rounded-xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={currentLightboxImage.src}
                  alt={currentLightboxImage.alt}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-white font-medium text-sm">
                    {(lang !== "en" &&
                      sections[lightbox.sectionIdx].translations?.hi?.label) ||
                      sections[lightbox.sectionIdx].name}
                  </p>
                  <p className="text-white/60 text-[12px] mt-0.5">
                    {(lang !== "en" &&
                      currentLightboxImage.translations?.hi?.alt) ||
                      currentLightboxImage.alt}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={(e) => {
                e.stopPropagation();
                lightboxNext();
              }}
              className="absolute right-4 md:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 border border-white/15"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Video Modal ── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            variants={lightboxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
            onClick={() => setActiveVideo(null)}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 border border-white/15 z-10"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              variants={lightboxImg}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-5xl w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.youtubeUrl)}
                title={
                  (lang !== "en" && activeVideo.translations?.hi?.title) ||
                  activeVideo.title
                }
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </motion.div>

            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-5xl w-full px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-lg px-5 py-3"
              >
                <h3 className="text-white font-semibold text-sm">
                  {(lang !== "en" && activeVideo.translations?.hi?.title) ||
                    activeVideo.title}
                </h3>
                {activeVideo.description && (
                  <p className="text-white/50 text-[12px] mt-1 line-clamp-2">
                    {(lang !== "en" &&
                      activeVideo.translations?.hi?.description) ||
                      activeVideo.description}
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MODE TOGGLE
   ═══════════════════════════════════════════════════════════════════════ */
function ModeToggle({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 whitespace-nowrap",
        active
          ? "bg-[#1077A6] text-white shadow-md shadow-[#1077A6]/20"
          : "bg-[#f4f3fb] text-[#1a1550]/50 hover:bg-[#1077A6]/10 hover:text-[#1077A6]",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FILTER TAB
   ═══════════════════════════════════════════════════════════════════════ */
function FilterTab({
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
        "flex-shrink-0 px-4 py-2 rounded-full text-[12.5px] font-semibold transition-all duration-200 whitespace-nowrap",
        active
          ? "bg-[#f4c430] text-[#1a1550] shadow-sm"
          : "bg-[#f4f3fb] text-[#1a1550]/60 hover:bg-[#1077A6]/10 hover:text-[#1077A6]",
      )}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PHOTO GALLERY SECTION
   ═══════════════════════════════════════════════════════════════════════ */
function GallerySectionComp({
  section,
  sectionIdx,
  onOpen,
  lang,
  dict,
}: {
  section: GallerySection;
  sectionIdx: number;
  onOpen: (sIdx: number, iIdx: number) => void;
  lang: string;
  dict: Record<string, any>;
}) {
  const sectionName =
    (lang !== "en" && section.translations?.hi?.label) || section.name;
  const sectionDesc =
    (lang !== "en" && section.translations?.hi?.description) ||
    section.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#1077A6]/10 flex items-center justify-center">
          <Images className="w-4 h-4 text-[#1077A6]" />
        </div>
        <div>
          <h2 className="font-display font-bold text-[#1a1550] text-[20px] leading-tight">
            {sectionName}
          </h2>
          <p className="text-[#1a1550]/40 text-[12px]">
            {section.images.length} {dict.gallery?.photos ?? "Photos"}
          </p>
        </div>
      </div>

      {sectionDesc && (
        <p className="text-[#1a1550]/55 text-[14px] mb-6 max-w-2xl leading-relaxed">
          {sectionDesc}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {section.images.map((img, i) => (
          <motion.div
            key={img.id}
            custom={i}
            variants={gridItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1077A6]/5 cursor-pointer border border-[#1077A6]/8 hover:border-[#f4c430]/40 hover:shadow-lg transition-all duration-300"
            onClick={() => onOpen(sectionIdx, i)}
          >
            <Image
              src={img.src}
              alt={(lang !== "en" && img.translations?.hi?.alt) || img.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white text-[12px] font-medium truncate">
                {(lang !== "en" && img.translations?.hi?.alt) || img.alt}
              </p>
            </div>
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
              <ZoomIn className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   VIDEO GALLERY GRID
   ═══════════════════════════════════════════════════════════════════════ */
function VideoGalleryGrid({
  videos,
  lang,
  dict,
  onPlay,
}: {
  videos: GalleryVideoItem[];
  lang: string;
  dict: Record<string, any>;
  onPlay: (video: GalleryVideoItem) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[#1077A6]/10 flex items-center justify-center">
          <Video className="w-4 h-4 text-[#1077A6]" />
        </div>
        <div>
          <h2 className="font-display font-bold text-[#1a1550] text-[20px] leading-tight">
            {dict.gallery?.videoGallery ?? "Video Gallery"}
          </h2>
          <p className="text-[#1a1550]/40 text-[12px]">
            {videos.length} {dict.gallery?.videosCount ?? "Videos"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((video, i) => {
          /* ── FIX 2: skip videos with unparseable/invalid YouTube URLs ── */
          const videoId = extractYouTubeId(video.youtubeUrl);
          if (!videoId) return null;

          const videoTitle =
            (lang !== "en" && video.translations?.hi?.title) || video.title;
          const videoDesc =
            (lang !== "en" && video.translations?.hi?.description) ||
            video.description;
          const thumbnailUrl = getYouTubeThumbnail(video.youtubeUrl);

          return (
            <motion.div
              key={video.id}
              custom={i}
              variants={gridItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => onPlay(video)}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1077A6]/5 border border-[#1077A6]/8 hover:border-[#f4c430]/40 shadow-sm hover:shadow-xl transition-all duration-300">
                <Image
                  src={thumbnailUrl}
                  alt={videoTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#f4c430] flex items-center justify-center shadow-lg shadow-black/30 group-hover:scale-110 transition-all duration-300">
                    <Play
                      className="w-6 h-6 text-[#1a1550] ml-0.5"
                      fill="#1a1550"
                    />
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  YouTube
                </div>
              </div>

              <div className="mt-3 px-1">
                <h3 className="font-semibold text-[#1a1550] text-[14px] leading-snug line-clamp-2 group-hover:text-[#1077A6] transition-colors duration-200">
                  {videoTitle}
                </h3>
                {videoDesc && (
                  <p className="text-[#1a1550]/45 text-[12px] mt-1 line-clamp-2 leading-relaxed">
                    {videoDesc}
                  </p>
                )}
                {video.publishedAt && (
                  <p className="text-[#1a1550]/30 text-[11px] mt-1.5 font-medium">
                    {new Date(video.publishedAt).toLocaleDateString(
                      lang === "hi" ? "hi-IN" : "en-IN",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
