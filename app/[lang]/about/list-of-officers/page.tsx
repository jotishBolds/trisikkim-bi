"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";
import StaffTable from "@/components/staff/StaffTable";
import PageHero from "@/components/PageHero";

interface Officer {
  id: number;
  name: string;
  designation: string;
  cadre?: string;
  email?: string;
  phone?: string;
  translations?: {
    hi?: { name?: string; designation?: string; cadre?: string };
  } | null;
}

export default function ListOfOfficersPage() {
  const { lang, dict } = useTranslation();
  const t = dict.listOfOfficers;
  const [query, setQuery] = useState("");
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/officers")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setOfficers(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tName = (s: Officer) =>
    (lang !== "en" && s.translations?.hi?.name) || s.name;
  const tDesignation = (s: Officer) =>
    (lang !== "en" && s.translations?.hi?.designation) || s.designation;

  const filtered = officers.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.designation.toLowerCase().includes(query.toLowerCase()) ||
      (s.cadre ?? "").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      <PageHero
        badge={t.breadcrumb}
        title={t.title}
        icon={<Users className="w-3.5 h-3.5 text-[#f4c430]" />}
      />

      {/* Search bar */}
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
              placeholder={t.searchPlaceholder}
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

      {/* Content */}
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
              {t.title}
            </h2>
            <div
              className="w-10 h-[3px] rounded-full mt-2"
              style={{ background: "#f4c430" }}
            />
            {query && (
              <p className="text-[#1077A6] text-[13px] font-medium mt-2">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
                &ldquo;
                <span className="font-bold">{query}</span>&rdquo;
              </p>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-[#1077A6]/20 border-t-[#1077A6] animate-spin" />
          </div>
        ) : (
          <StaffTable
            members={filtered}
            query={query}
            onClearQuery={() => setQuery("")}
            tName={tName}
            tDesignation={tDesignation}
          />
        )}

        {!loading && filtered.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-[12.5px] text-[#1a1550]/35 mt-8"
          >
            {t.showing} {filtered.length} {t.of} {officers.length} {t.officers}
          </motion.p>
        )}
      </div>
    </div>
  );
}
