"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Images } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/use-translation";
import PageHero from "@/components/PageHero";

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

export default function GalleryPage() {
  const { lang, dict } = useTranslation();
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{
    sectionIdx: number;
    imgIdx: number;
  } | null>(null);
  const [activeSection, setActiveSection] = useState<string>("all");

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSections(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      <PageHero
        badge={dict.gallery.subtitle}
        title={dict.gallery.title}
        icon={<Images className="w-3.5 h-3.5 text-[#f4c430]" />}
      />

      {/* Filter tabs */}
      <div className="sticky top-[var(--navbar-height,0)] z-30 bg-white border-b border-[#1077A6]/8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            <FilterTab
              active={activeSection === "all"}
              onClick={() => setActiveSection("all")}
            >
              {dict.gallery.allSections}
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-20">
        {loading ? (
          <div className="text-center text-[#1a1550]/40 py-20">
            {dict.gallery.loading}
          </div>
        ) : (
          visibleSections.map((section) => {
            const realSectionIdx = sections.findIndex(
              (s) => s.id === section.id,
            );
            return (
              <GallerySectionComp
                key={section.id}
                section={section}
                sectionIdx={realSectionIdx}
                onOpen={openLightbox}
                lang={lang}
                dict={dict}
              />
            );
          })
        )}
      </div>

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
    </div>
  );
}

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
          ? "bg-[#1077A6] text-white shadow-sm"
          : "bg-[#f4f3fb] text-[#1a1550]/60 hover:bg-[#1077A6]/10 hover:text-[#1077A6]",
      )}
    >
      {children}
    </button>
  );
}

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
  dict: any;
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
            {section.images.length} {dict.gallery.photos}
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
