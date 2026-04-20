"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/use-translation";

interface Translations {
  hi?: Record<string, string>;
}

interface SlideData {
  id: number;
  image: string;
  headline: string;
  caption: string;
  translations?: Translations | null;
}

const INTERVAL = 5500;
const POLL_INTERVAL = 3000;

const imageVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? "100%" : "-100%",
    opacity: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const textVariants: Variants = {
  enter: { opacity: 0, y: 20 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.2 },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function HeroCarousel() {
  const { lang } = useTranslation();
  const [slides, setSlides] = useState<SlideData[] | null>(null); // null = loading
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevSlidesRef = useRef<string>("");

  const fetchSlides = useCallback(async () => {
    try {
      const res = await fetch("/api/hero-slides", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const d = await res.json();

      if (d.success) {
        const newJson = JSON.stringify(d.data);

        if (newJson !== prevSlidesRef.current) {
          prevSlidesRef.current = newJson;
          setSlides(d.data); // could be empty array []

          setCurrent((prev) =>
            d.data.length === 0 ? 0 : Math.min(prev, d.data.length - 1),
          );
        }
      }
    } catch {
      if (slides === null) setSlides([]);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  useEffect(() => {
    pollRef.current = setInterval(fetchSlides, POLL_INTERVAL);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchSlides]);

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    if (!slides || slides.length === 0) return;
    goTo((current + 1) % slides.length, 1);
  }, [current, slides, goTo]);

  const prev = useCallback(() => {
    if (!slides || slides.length === 0) return;
    goTo((current - 1 + slides.length) % slides.length, -1);
  }, [current, slides, goTo]);

  useEffect(() => {
    if (paused || !slides || slides.length <= 1) return;
    intervalRef.current = setInterval(next, INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, next, slides]);

  useEffect(() => {
    setProgress(0);
    if (paused || !slides || slides.length <= 1) return;
    const step = 100 / (INTERVAL / 50);
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + step, 100));
    }, 50);
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, paused, slides]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  if (slides === null) {
    return (
      <section className="w-full">
        <div className="relative w-full h-[320px] sm:h-[420px] md:h-[520px] lg:h-[600px] bg-[#1077a6] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-white/50">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="w-full">
        <div
          className="relative w-full h-[320px] sm:h-[420px] md:h-[520px] lg:h-[600px] flex items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #1077a6 0%, #0d5a80 50%, #1a1550 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#f4c430 1px, transparent 1px), linear-gradient(90deg, #f4c430 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="flex flex-col items-center gap-4 text-center px-6 z-10">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <ImageOff className="w-7 h-7 text-white/40" />
            </div>
            <div>
              <p className="text-white/60 text-lg font-semibold">
                No slides uploaded yet
              </p>
              <p className="text-white/30 text-sm mt-1">
                Add slides from the admin panel to display them here.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const rawSlide = slides[current] ?? slides[0];
  const t = lang !== "en" ? rawSlide.translations?.hi : null;
  const slide = {
    ...rawSlide,
    headline: t?.headline || rawSlide.headline,
    caption: t?.caption || rawSlide.caption,
  };

  return (
    <section
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero image carousel"
    >
      <div className="relative w-full h-[320px] sm:h-[420px] md:h-[520px] lg:h-[600px] overflow-hidden bg-[#1077a6]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.headline.replace("\n", " ")}
              fill
              priority={current === 0}
              className="object-cover"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(16,119,166,0.92) 0%, rgba(16,119,166,0.70) 20%, rgba(16,119,166,0.40) 35%, rgba(16,119,166,0.15) 45%, rgba(16,119,166,0) 55%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(16,119,166,0.25) 0%, rgba(16,119,166,0) 50%), linear-gradient(to right, rgba(16,119,166,0.20) 0%, transparent 40%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#f4c430 1px, transparent 1px), linear-gradient(90deg, #f4c430 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {slides.length > 1 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
            <motion.div
              className="h-full bg-[#f4c430]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0 }}
            />
          </div>
        )}

        {slides.length > 1 && (
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 bg-[#1077a6]/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/15">
            <span className="text-white text-xs sm:text-sm font-mono">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-8 md:px-12 pb-6 sm:pb-8 md:pb-10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {slide.headline && (
                    <h1 className="font-display font-bold text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight">
                      {slide.headline.split("\n").map((line, i) => (
                        <span key={i}>
                          {i === 1 ? (
                            <span className="text-[#f4c430]"> {line}</span>
                          ) : (
                            line
                          )}
                        </span>
                      ))}
                    </h1>
                  )}

                  <div className="w-14 h-[3px] rounded-full bg-[#f4c430] mt-3" />

                  {slide.caption && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25 }}
                      className="mt-3 text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl"
                    >
                      {slide.caption}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {slides.length > 1 && (
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => goTo(i, i > current ? 1 : -1)}
                      aria-label={`Go to slide ${i + 1}`}
                      className="group p-1"
                    >
                      <span
                        className={cn(
                          "block rounded-full transition-all duration-300",
                          i === current
                            ? "w-8 h-2 bg-[#f4c430]"
                            : "w-2 h-2 bg-white/40 group-hover:bg-white/70",
                        )}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <NavButton onClick={prev} dir="prev" />
                  <NavButton onClick={next} dir="next" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function NavButton({
  onClick,
  dir,
}: {
  onClick: () => void;
  dir: "prev" | "next";
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      className={cn(
        "w-9 h-9 sm:w-10 sm:h-10 rounded-full",
        "bg-white/15 border border-white/25",
        "flex items-center justify-center text-white",
        "hover:bg-white/25 hover:border-white/50",
        "transition-all duration-200",
      )}
    >
      {dir === "prev" ? (
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      ) : (
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
    </motion.button>
  );
}
