"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ExternalLink, Users, Clock, Eye } from "lucide-react";

const DEFAULT_LINKS = [
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

const CENTER_LOGO = { src: "/logos/tritc-logo.png", alt: "TRITC Sikkim" };

const colVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" },
  }),
};

const linkVariant: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.055, duration: 0.25 },
  }),
};

export default function Footer() {
  const [visitors, setVisitors] = useState("—");
  const [lastUpdated, setLastUpdated] = useState("—");
  const [relatedLinks, setRelatedLinks] = useState(DEFAULT_LINKS);

  useEffect(() => {
    // Load settings (Record<string, string>)
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data && typeof d.data === "object") {
          const s = d.data as Record<string, string>;
          if (s.visitors_count)
            setVisitors(Number(s.visitors_count).toLocaleString("en-IN"));
          if (s.footer_links) {
            try {
              const parsed = JSON.parse(s.footer_links);
              if (Array.isArray(parsed)) setRelatedLinks(parsed);
            } catch {}
          }
        }
      })
      .catch(() => {});

    // Auto last-updated from DB
    fetch("/api/settings/last-updated")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.date) setLastUpdated(d.date);
      })
      .catch(() => {});
  }, []);

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

      <footer className="bg-[#1077A6] text-white font-body">
        <div className="h-[3px] bg-gradient-to-r from-[#f4c430] via-white/20 to-[#f4c430]" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          <motion.div
            custom={0}
            variants={colVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionHeading>Related Links</SectionHeading>
            <ul className="mt-5 space-y-[10px]">
              {relatedLinks.map((link, i) => (
                <motion.li
                  key={link.label}
                  custom={i}
                  variants={linkVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-[13px] text-white/70 hover:text-black transition-colors duration-200 leading-snug group"
                  >
                    <ExternalLink className="w-3 h-3 mt-[3px] flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity group-hover:text-black" />
                    <span className="group-hover:bg-[#f4c430] group-hover:px-1 group-hover:py-0.5 group-hover:-my-0.5 group-hover:rounded transition-all duration-200">
                      {link.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            custom={1}
            variants={colVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#f4c430]/20 blur-xl scale-150 pointer-events-none" />
              <div className="relative rounded-full border-2 border-[#f4c430]/30 bg-white/8 p-[5px] overflow-hidden">
                <Image
                  src={"/tribal.png"}
                  alt={CENTER_LOGO.alt}
                  width={88}
                  height={88}
                  className="rounded-full object-contain"
                  unoptimized
                />
              </div>
            </div>

            <div>
              <p className="font-display font-bold text-[14px] leading-snug tracking-tight">
                Tribal Research Institute
                <br />
                &amp; Training Centre
              </p>
              <p className="text-white/55 text-[12px] mt-1">
                Social Welfare Department
              </p>
              <p className="text-white/45 text-[11px]">Government of Sikkim</p>
            </div>
          </motion.div>

          <motion.div
            custom={2}
            variants={colVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionHeading>Website Info</SectionHeading>
            <div className="mt-5 space-y-4">
              <InfoRow
                icon={<Users className="w-4 h-4" />}
                label="Number of Visitors"
                value={visitors}
              />

              <InfoRow
                icon={<Clock className="w-4 h-4" />}
                label="Last Updated"
                value={lastUpdated}
              />

              <div className="flex items-center gap-3 group">
                <IconBox>
                  <Eye className="w-4 h-4" />
                </IconBox>
                <div>
                  <p className="text-white/45 text-[10.5px] uppercase tracking-widest mb-0.5">
                    Accessibility
                  </p>
                  <Link
                    href="/screen-reader"
                    className="text-[13px] text-white/70 hover:text-black transition-colors font-medium group-hover:bg-[#f4c430] group-hover:px-2 group-hover:py-0.5 group-hover:-my-0.5 group-hover:rounded transition-all duration-200"
                  >
                    Screen Reader Access
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/12 bg-[#0e6590]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 text-center relative">
            {/* Small yellow dot decoration */}
            <div className="absolute left-1/2 -top-[2px] transform -translate-x-1/2 w-12 h-[3px] bg-[#f4c430] rounded-b-full opacity-50" />
            <p className="text-white/50 text-[12px] tracking-wide">
              Copyright &copy; 2026 Tribal Research Institute, Government of
              Sikkim. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display font-bold text-[11px] uppercase tracking-[.18em] text-[#f4c430] pb-2 border-b border-white/18">
      {children}
    </h3>
  );
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-[#f4c430] group-hover:bg-[#f4c430]/20 transition-colors duration-200">
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
      <div>
        <p className="text-white/45 text-[10.5px] uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-white font-semibold text-[13.5px] leading-snug group-hover:text-black group-hover:bg-[#f4c430] group-hover:px-2 group-hover:py-0.5 group-hover:-my-0.5 group-hover:rounded transition-all duration-200">
          {value}
        </p>
      </div>
    </div>
  );
}
