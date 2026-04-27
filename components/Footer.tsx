"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ExternalLink,
  Users,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation, langHref } from "@/lib/i18n/use-translation";

type FooterLink = {
  label: string;
  href: string;
};

const DEFAULT_LINKS: FooterLink[] = [
  { label: "National Tribal Research Portal", href: "https://tribal.nic.in" },
  {
    label: "Ministry of Tribal Affairs – Govt. of India",
    href: "https://tribal.gov.in",
  },
  { label: "National Scholarship Portal", href: "https://scholarships.gov.in" },
  { label: "E-Services Sikkim", href: "https://sikkim.gov.in" },
  { label: "State Portal of Sikkim", href: "https://sikkim.gov.in" },
  {
    label: "Social Welfare Department – Govt. of Sikkim",
    href: "https://socialwelfaresikkim.gov.in",
  },
];

const CENTER_LOGO = { src: "/tribal.png", alt: "TRITC Sikkim" };
const LINKS_PER_PAGE = 4;

const smoothSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 30,
  mass: 1,
};

const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const pageSlide: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: smoothSpring,
      opacity: { duration: 0.3, ease: "easeOut" },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -200 : 200,
    opacity: 0,
    transition: {
      x: smoothSpring,
      opacity: { duration: 0.2, ease: "easeIn" },
    },
  }),
};

const initialCardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const paginatedCardVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 + i * 0.07,
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function Footer() {
  const { lang, dict } = useTranslation();
  const [visitors, setVisitors] = useState("—");
  const [lastUpdated, setLastUpdated] = useState("—");
  const [relatedLinks, setRelatedLinks] = useState<FooterLink[]>(DEFAULT_LINKS);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const isFirstRender = useRef(true);

  const totalPages = useMemo(
    () => Math.ceil(relatedLinks.length / LINKS_PER_PAGE),
    [relatedLinks.length],
  );

  const currentLinks = useMemo(() => {
    const start = currentPage * LINKS_PER_PAGE;
    return relatedLinks.slice(start, start + LINKS_PER_PAGE);
  }, [relatedLinks, currentPage]);

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPages || page === currentPage) return;
    isFirstRender.current = false;
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/settings/last-updated").then((r) => r.json()),
    ])
      .then(([settingsRes, updatedRes]) => {
        if (
          settingsRes.success &&
          settingsRes.data &&
          typeof settingsRes.data === "object"
        ) {
          const s = settingsRes.data as Record<string, string>;

          if (s.visitors_count) {
            setVisitors(Number(s.visitors_count).toLocaleString("en-IN"));
          }

          if (s.footer_links) {
            try {
              const parsed = JSON.parse(s.footer_links);
              if (Array.isArray(parsed)) {
                const filtered = parsed.filter(
                  (item): item is FooterLink =>
                    item &&
                    typeof item.label === "string" &&
                    typeof item.href === "string",
                );
                setRelatedLinks(filtered);
                setCurrentPage(0);
              }
            } catch {}
          }
        }

        if (updatedRes.success && updatedRes.date) {
          setLastUpdated(updatedRes.date);
        }
      })
      .catch(() => {});
  }, []);

  const activeCardVariant = isFirstRender.current
    ? initialCardVariant
    : paginatedCardVariant;

  return (
    <>
      <div
        className="w-full h-[20px] md:h-[40px] pointer-events-none"
        style={{
          backgroundImage: "url('/main-tri.png')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "center center",
          backgroundBlendMode: "normal",
        }}
      />

      <footer className="bg-[#1077A6] text-white font-body overflow-hidden">
        <div className="h-[3px] bg-linear-to-r from-[#f4c430] via-white/20 to-[#f4c430]" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10 space-y-6 md:space-y-8">
          <motion.div
            custom={0}
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 md:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <SectionHeading>{dict.footer.relatedLinks}</SectionHeading>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
                className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70 w-fit"
              >
                {relatedLinks.length} Links
              </motion.span>
            </div>

            <div className="relative overflow-hidden">
              <AnimatePresence custom={direction} mode="wait" initial={false}>
                <motion.div
                  key={currentPage}
                  custom={direction}
                  variants={isFirstRender.current ? undefined : pageSlide}
                  initial={isFirstRender.current ? false : "enter"}
                  animate="center"
                  exit="exit"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                >
                  {currentLinks.map((link, i) => (
                    <motion.a
                      key={`${link.label}-${currentPage}-${i}`}
                      custom={i}
                      variants={activeCardVariant}
                      initial="hidden"
                      animate="visible"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group h-full rounded-xl border border-white/10 bg-white/[0.045] p-3.5 hover:bg-[#f4c430] hover:border-[#f4c430] transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#f4c430] group-hover:bg-black/10 group-hover:text-black transition-colors duration-200">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] leading-snug font-medium text-white/85 group-hover:text-black break-words transition-colors duration-200">
                            {link.label}
                          </p>
                          <p className="text-[11px] mt-1 text-white/40 group-hover:text-black/70 truncate transition-colors duration-200">
                            {link.href}
                          </p>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
                className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-white/8"
              >
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="group w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                </button>

                <div className="flex items-center gap-1.5 px-2">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToPage(idx)}
                      className="relative group/dot"
                    >
                      <motion.div
                        className="rounded-full"
                        animate={{
                          width: currentPage === idx ? 24 : 8,
                          height: 8,
                          backgroundColor:
                            currentPage === idx
                              ? "#f4c430"
                              : "rgba(255,255,255,0.2)",
                        }}
                        whileHover={{
                          backgroundColor:
                            currentPage === idx
                              ? "#f4c430"
                              : "rgba(255,255,255,0.4)",
                          scale: currentPage === idx ? 1 : 1.3,
                        }}
                        whileTap={{ scale: 0.9 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      />
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white/60 bg-black/40 px-2 py-0.5 rounded-md opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="group w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                </button>

                <div className="ml-2 pl-2 border-l border-white/10">
                  <span className="text-[11px] font-medium text-white/40">
                    {currentPage + 1} <span className="text-white/25">of</span>{" "}
                    {totalPages}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5 md:gap-6">
            <motion.div
              custom={1}
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="rounded-2xl border border-white/12 bg-white/[0.04] p-5 md:p-6"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-[#f4c430]/20 blur-xl scale-150 pointer-events-none" />
                  <div className="relative rounded-full border-2 border-[#f4c430]/30 bg-white/8 p-[6px] overflow-hidden">
                    <Image
                      src={CENTER_LOGO.src}
                      alt={CENTER_LOGO.alt}
                      width={96}
                      height={96}
                      className="rounded-full object-contain"
                      unoptimized
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-[16px] md:text-[17px] leading-snug tracking-tight">
                    {dict.header.instituteName.split("&").length > 1 ? (
                      <>
                        {dict.header.instituteName.split("&")[0].trim()}
                        <br />
                        &amp; {dict.header.instituteName.split("&")[1].trim()}
                      </>
                    ) : (
                      dict.header.instituteName
                    )}
                  </p>
                  <p className="text-white/60 text-[13px] mt-2">
                    {dict.header.department}
                  </p>
                  <p className="text-white/45 text-[12px] mt-1">
                    {dict.header.government}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              custom={2}
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="rounded-2xl border border-white/12 bg-white/[0.04] p-5 md:p-6"
            >
              <SectionHeading>{dict.footer.websiteInfo}</SectionHeading>

              <div className="mt-5 space-y-4">
                <InfoRow
                  icon={<Users className="w-4 h-4" />}
                  label={dict.footer.numberOfVisitors}
                  value={visitors}
                />

                <InfoRow
                  icon={<Clock className="w-4 h-4" />}
                  label={dict.footer.lastUpdated}
                  value={lastUpdated}
                />

                <div className="flex items-center gap-3 group">
                  <IconBox>
                    <Eye className="w-4 h-4" />
                  </IconBox>
                  <div className="min-w-0">
                    <p className="text-white/45 text-[10.5px] uppercase tracking-widest mb-0.5">
                      {dict.footer.accessibility}
                    </p>
                    <Link
                      href={langHref(lang, "/screen-reader")}
                      className="inline-flex max-w-full text-[13px] font-medium text-white/75 hover:text-black group-hover:bg-[#f4c430] group-hover:px-2 group-hover:py-0.5 group-hover:-my-0.5 group-hover:rounded transition-all duration-200"
                    >
                      <span className="truncate">
                        {dict.footer.screenReaderAccess}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="border-t border-white/12 bg-[#0e6590]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 text-center relative">
            <div className="absolute left-1/2 -top-[2px] -translate-x-1/2 w-12 h-[3px] bg-[#f4c430] rounded-b-full opacity-50" />
            <p className="text-white/50 text-[12px] tracking-wide">
              {dict.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display font-bold text-[11px] uppercase tracking-[.18em] text-[#f4c430]">
      {children}
    </h3>
  );
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#f4c430] group-hover:bg-[#f4c430]/20 transition-colors duration-200">
      {children}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 group">
      <IconBox>{icon}</IconBox>
      <div className="min-w-0">
        <p className="text-white/45 text-[10.5px] uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="inline-flex max-w-full text-white font-semibold text-[13.5px] leading-snug group-hover:text-black group-hover:bg-[#f4c430] group-hover:px-2 group-hover:py-0.5 group-hover:-my-0.5 group-hover:rounded transition-all duration-200">
          <span className="truncate">{value}</span>
        </p>
      </div>
    </div>
  );
}
