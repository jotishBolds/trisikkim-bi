"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  BookOpen,
  Users,
  Award,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideData {
  id: number;
  image: string;
  tag: string;
  tagIcon: string;
  headline: string;
  subtext: string;
  ctaLabel: string;
  ctaHref: string;
  accent: string;
  statValue: string;
  statLabel: string;
}

const TAG_ICONS: Record<string, React.ElementType> = {
  Leaf,
  MapPin,
  BookOpen,
  Users,
  Award,
};

const FALLBACK_SLIDES: SlideData[] = [
  {
    id: 1,
    image: "/DJI_0057-scaled.jpg",
    tag: "Heritage & Culture",
    tagIcon: "Leaf",
    headline: "Preserving the Living\nLegacy of Sikkim's Tribes",
    subtext:
      "Dedicated to the documentation, research, and celebration of the indigenous communities that define the cultural fabric of Sikkim.",
    ctaLabel: "Explore Tribes",
    ctaHref: "/tribes",
    accent: "#f4c430",
    statValue: "12+",
    statLabel: "Tribal Communities",
  },
];

const INTERVAL = 5500;

const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? "100%" : "-100%",
    opacity: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const contentContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HeroCarousel() {
  const [slides, setSlides] = useState<SlideData[]>(FALLBACK_SLIDES);
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

  const slide = slides[current] || slides[0];
  const TagIcon = TAG_ICONS[slide.tagIcon] || Leaf;

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
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 145px)", minHeight: 500, maxHeight: 780 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero image carousel"
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className={cn("absolute inset-0 slide-active")}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="slide-bg absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.headline.replace("\n", " ")}
                fill
                priority={current === 0}
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-[#1077A6]/90 via-[#1077A6]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1077A6]/80 via-transparent to-transparent" />

            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                backgroundRepeat: "repeat",
                backgroundSize: "128px",
              }}
            />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-center">
            <motion.div
              key={`content-${current}`}
              variants={contentContainer}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <motion.div
                variants={fadeLeft}
                className="flex items-center gap-2 mb-5"
              >
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[.14em] uppercase border"
                  style={{
                    background: `#f4c43018`,
                    borderColor: `#f4c43040`,
                    color: "#f4c430",
                  }}
                >
                  <TagIcon className="w-3 h-3" />
                  {slide.tag}
                </div>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                className="font-display font-bold text-white text-[clamp(28px,4.5vw,58px)] leading-[1.1] tracking-tight mb-5"
              >
                {slide.headline.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {i === 1 ? (
                      <span style={{ color: "#f4c430" }}>{line}</span>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="text-white/70 text-[15px] md:text-[16.5px] leading-relaxed mb-8 max-w-lg"
              >
                {slide.subtext}
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex items-center gap-4 flex-wrap"
              >
                <Link
                  href={slide.ctaHref}
                  className="group flex items-center gap-2 px-6 py-3 rounded-lg text-[14px] font-semibold tracking-wide transition-all duration-300 shadow-lg hover:scale-105"
                  style={{
                    background: "#f4c430",
                    color: "#1077A6",
                  }}
                >
                  {slide.ctaLabel}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>

                <div className="flex items-center gap-3 px-5 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
                  <div>
                    <div
                      className="text-white font-display font-bold text-[22px] leading-none"
                      style={{ color: "#f4c430" }}
                    >
                      {slide.statValue}
                    </div>
                    <div className="text-white/55 text-[11px] tracking-wide mt-0.5">
                      {slide.statLabel}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute right-0 top-0 bottom-0 w-[30%] pointer-events-none hidden lg:block">
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-20"
          style={{ background: "#f4c430" }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={`deco-${current}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { delay: 0.5, duration: 0.8 },
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
            className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
          >
            <div
              className="text-[80px] font-display font-bold leading-none select-none"
              style={{ color: "#f4c43015" }}
            >
              {String(current + 1).padStart(2, "0")}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-[2px] bg-white/10 w-full">
          <motion.div
            className="h-full"
            style={{ width: `${progress}%`, background: "#f4c430" }}
            transition={{ duration: 0 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative flex items-center justify-center"
              >
                <span
                  className={cn(
                    "block rounded-full transition-all duration-400",
                    i === current ? "w-6 h-2" : "w-2 h-2 hover:bg-white/60",
                  )}
                  style={{
                    background:
                      i === current ? "#f4c430" : "rgba(255,255,255,0.35)",
                  }}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/40 text-[12px] font-mono tracking-widest hidden sm:block">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>

            <div className="flex gap-2">
              <NavButton onClick={prev} dir="prev" />
              <NavButton onClick={next} dir="next" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "relative w-12 h-8 rounded overflow-hidden border transition-all duration-300",
              i === current
                ? "border-[#f4c430] scale-110 shadow-lg"
                : "border-white/20 opacity-50 hover:opacity-80 hover:scale-105",
            )}
          >
            <Image
              src={s.image}
              alt={`Slide ${i + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            {i === current && (
              <div className="absolute inset-0 bg-[#f4c430]/20" />
            )}
          </button>
        ))}
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
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:border-[#f4c430] hover:bg-[#f4c430]/20 transition-all duration-200"
    >
      {dir === "prev" ? (
        <ChevronLeft className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </motion.button>
  );
}
