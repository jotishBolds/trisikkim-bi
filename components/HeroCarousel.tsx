"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const { lang, dict } = useTranslation();
  const fallbackSlides: SlideData[] = [
    {
      id: 1,
      image: "/tri.jpeg",
      headline: dict.hero?.fallbackHeadline || "Welcome",
      caption: "",
    },
  ];
  const [slides, setSlides] = useState<SlideData[]>(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/hero-slides")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.length > 0) setSlides(d.data);
      })
      .catch(() => {});
  }, []);

  const rawSlide = slides[current] || slides[0];
  const t = lang !== "en" ? rawSlide.translations?.hi : null;
  const slide = {
    ...rawSlide,
    headline: t?.headline || rawSlide.headline,
    caption: t?.caption || rawSlide.caption, // NEW: Translate caption
  };

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 1);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, -1);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, next]);

  useEffect(() => {
    setProgress(0);
    if (paused) return;
    const step = 100 / (INTERVAL / 50);
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + step, 100));
    }, 50);
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, paused]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  return (
    <section
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero image carousel"
    >
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden bg-gray-100">
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

        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-white text-xs sm:text-sm font-mono">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="bg-[#1077A6] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f4c430 1px, transparent 1px), linear-gradient(90deg, #f4c430 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-linear-to-l from-[#f4c430]/8 to-transparent pointer-events-none" />

        <div className="absolute top-0 left-0 right-0 h-1 bg-[#0d5f82]">
          <motion.div
            className="h-full bg-[#f4c430]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0 }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 py-5 sm:py-6 md:py-8">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
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

                  <div className="w-14 h-[3px] rounded-full bg-[#f4c430] mt-3" />

                  {slide.caption && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25 }}
                      className="mt-4 text-white/90 text-sm sm:text-base leading-relaxed max-w-3xl"
                    >
                      {slide.caption}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 sm:pt-2">
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
        "bg-white/10 border border-white/20",
        "flex items-center justify-center text-white",
        "hover:bg-white/20 hover:border-white/40",
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
