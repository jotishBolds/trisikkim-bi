"use client";

import { motion, Variants } from "framer-motion";
import { Users, Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface StaffMember {
  id: number;
  name: string;
  position: string;
}

function getBadgeStyle(position: string): React.CSSProperties {
  if (position.includes("Director") || position.includes("Secretary"))
    return { background: "#1077A6", color: "#fff" };
  if (position.includes("Research Officer"))
    return { background: "#f4c430", color: "#1a1550" };
  if (position.includes("Welfare Inspector"))
    return {
      background: "#1077A620",
      color: "#1077A6",
      border: "1px solid #1077A640",
    };
  return { background: "#f0eefc", color: "#1a1550" };
}

function initials(name: string) {
  const parts = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/i, "").split(" ");
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function avatarBg(index: number) {
  const palettes = [
    { bg: "#1077A6", text: "#fff" },
    { bg: "#f4c430", text: "#1a1550" },
    { bg: "#1a1550", text: "#f4c430" },
    { bg: "#e8f4fb", text: "#1077A6" },
  ];
  return palettes[index % palettes.length];
}

const createRowVariants = (index: number): Variants => ({
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.03, duration: 0.35, ease: "easeOut" },
  },
});

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.35, ease: "easeOut" },
  }),
};

export default function WhosWhoPage() {
  const [query, setQuery] = useState("");
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStaffList(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.position.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      <div className="bg-[#1077A6] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f4c430 1px, transparent 1px), linear-gradient(90deg, #f4c430 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-[#f4c430]/8 to-transparent pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#f4c430]/5 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-[#f4c430]/15 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-[#f4c430]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#f4c430]">
                About / Who's Who
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-[clamp(26px,4vw,44px)] leading-tight tracking-tight mb-3">
              Who&apos;s Who
            </h1>
            <div className="w-14 h-[3px] rounded-full bg-[#f4c430] mb-4" />
            <p className="text-white/65 text-[15px] max-w-xl leading-relaxed">
              Meet the dedicated team of officials and staff at the Tribal
              Research Institute &amp; Training Centre, Sikkim.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-5 mt-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f4c430]" />
                <span className="text-white/50 text-[12.5px]">
                  {staffList.length} Members
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/30" />
                <span className="text-white/50 text-[12.5px]">
                  Social Welfare Department
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="sticky top-[var(--navbar-height,0)] z-30 bg-white border-b border-[#1077A6]/8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <div className="relative max-w-sm">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1077A6]/50 pointer-events-none"
              style={{ width: 15, height: 15 }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or position…"
              className="w-full pl-9 pr-8 py-2.5 text-[13px] text-[#1a1550] bg-[#f8f7fc] border border-[#1077A6]/15 rounded-lg outline-none focus:border-[#1077A6]/40 focus:ring-2 focus:ring-[#1077A6]/10 transition-all duration-200 placeholder:text-[#1a1550]/35"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1550]/40 hover:text-[#1a1550]/70 transition-colors"
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start gap-4 mb-8"
        >
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border mt-0.5"
            style={{ background: "#1077A615", borderColor: "#1077A630" }}
          >
            <Users className="w-5 h-5 text-[#1077A6]" />
          </div>
          <div>
            <h2 className="font-display font-bold text-[#1a1550] text-[22px] leading-tight">
              Staff Directory
            </h2>
            <div
              className="w-10 h-[3px] rounded-full mt-2"
              style={{ background: "#f4c430" }}
            />
            {query && (
              <p className="text-[#1077A6] text-[13px] font-medium mt-2">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
                <span className="font-bold">{query}</span>"
              </p>
            )}
          </div>
        </motion.div>

        <div className="hidden md:block bg-white rounded-2xl border border-[#1077A6]/10 shadow-sm overflow-hidden">
          <div
            className="grid grid-cols-[60px_1fr_1fr] gap-0"
            style={{ background: "#1077A6" }}
          >
            <div className="px-5 py-4 text-[11px] font-bold uppercase tracking-[.16em] text-white/60">
              #
            </div>
            <div className="px-5 py-4 text-[11px] font-bold uppercase tracking-[.16em] text-white">
              Name
            </div>
            <div className="px-5 py-4 text-[11px] font-bold uppercase tracking-[.16em] text-white">
              Position / Designation
            </div>
          </div>

          <div className="divide-y divide-[#1077A6]/6">
            {filtered.map((staff, i) => {
              const av = avatarBg(i);
              return (
                <motion.div
                  key={staff.name}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-20px" }}
                  whileHover={{
                    backgroundColor: "#e8f4fb",
                    x: 3,
                    transition: { duration: 0.18 },
                  }}
                  className="grid grid-cols-[60px_1fr_1fr] gap-0 cursor-default"
                >
                  <div className="px-5 py-4 flex items-center">
                    <span className="text-[12px] font-mono font-semibold text-[#1a1550]/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="px-5 py-4 flex items-center gap-3">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold transition-transform duration-200 group-hover:scale-110"
                      style={{ background: av.bg, color: av.text }}
                    >
                      {initials(staff.name)}
                    </div>
                    <span className="font-semibold text-[#1a1550] text-[14px]">
                      {staff.name}
                    </span>
                  </div>

                  <div className="px-5 py-4 flex items-center">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold"
                      style={getBadgeStyle(staff.position)}
                    >
                      {staff.position}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 flex flex-col items-center gap-3 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "#1077A610" }}
              >
                <Search className="w-5 h-5 text-[#1077A6]/50" />
              </div>
              <p className="text-[#1a1550]/50 text-[14px]">
                No results found for "
                <span className="font-semibold">{query}</span>"
              </p>
              <button
                onClick={() => setQuery("")}
                className="text-[13px] font-semibold text-[#1077A6] hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden space-y-3">
          {filtered.map((staff, i) => {
            const av = avatarBg(i);
            return (
              <motion.div
                key={staff.name}
                custom={i}
                variants={rowVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10px" }}
                whileHover={{
                  y: -2,
                  boxShadow: "0 6px 20px rgba(16,119,166,0.12)",
                }}
                className="bg-white rounded-xl border border-[#1077A6]/10 p-4 flex items-center gap-4 transition-all duration-200"
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold"
                  style={{ background: av.bg, color: av.text }}
                >
                  {initials(staff.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#1a1550] text-[14px] leading-tight truncate">
                    {staff.name}
                  </p>
                  <div className="mt-1.5">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                      style={getBadgeStyle(staff.position)}
                    >
                      {staff.position}
                    </span>
                  </div>
                </div>

                {/* Row number */}
                <span className="flex-shrink-0 text-[11px] font-mono text-[#1a1550]/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-14 flex flex-col items-center gap-3 text-center">
              <p className="text-[#1a1550]/50 text-[14px]">No results found.</p>
              <button
                onClick={() => setQuery("")}
                className="text-[13px] font-semibold text-[#1077A6] hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-[12.5px] text-[#1a1550]/35 mt-8"
          >
            Showing {filtered.length} of {staffList.length} staff members
          </motion.p>
        )}
      </div>
    </div>
  );
}
