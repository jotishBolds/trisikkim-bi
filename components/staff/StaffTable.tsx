"use client";

import { motion, Variants } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface StaffMember {
  id: number;
  name: string;
  designation: string;
  cadre?: string;
  email?: string;
  phone?: string;
}

function getBadgeStyle(designation: string): React.CSSProperties {
  if (designation.includes("Director") || designation.includes("Secretary"))
    return { background: "#1077A6", color: "#fff" };
  if (designation.includes("Research Officer"))
    return { background: "#f4c430", color: "#1a1550" };
  if (designation.includes("Welfare Inspector"))
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

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.35, ease: "easeOut" },
  }),
};

const PAGE_SIZE_OPTIONS = [10, 25, 50];

interface Props {
  members: StaffMember[];
  query: string;
  onClearQuery: () => void;
  noResultsLabel?: string;
  clearLabel?: string;
  tName?: (s: StaffMember) => string;
  tDesignation?: (s: StaffMember) => string;
}

export default function StaffTable({
  members,
  query,
  onClearQuery,
  noResultsLabel = "No results found.",
  clearLabel = "Clear search",
  tName,
  tDesignation,
}: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [members.length, query]);

  const getName = (s: StaffMember) => (tName ? tName(s) : s.name);
  const getDesignation = (s: StaffMember) =>
    tDesignation ? tDesignation(s) : s.designation;

  const totalPages = Math.ceil(members.length / pageSize);
  const paginated = members.slice((page - 1) * pageSize, page * pageSize);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <>
      <div className="hidden md:block bg-white rounded-2xl border border-[#1077A6]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr style={{ background: "#1077A6" }}>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[.16em] text-white/60 w-14">
                  #
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[.16em] text-white">
                  Name
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[.16em] text-white">
                  Designation
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[.16em] text-white">
                  Cadre
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[.16em] text-white">
                  Email
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1077A6]/6">
              {paginated.map((staff, i) => {
                const av = avatarBg(i);

                const globalIndex = (page - 1) * pageSize + i;
                return (
                  <motion.tr
                    key={staff.id}
                    custom={i}
                    variants={rowVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20px" }}
                    whileHover={{
                      backgroundColor: "#e8f4fb",
                      transition: { duration: 0.18 },
                    }}
                    className="cursor-default"
                  >
                    <td className="px-5 py-4">
                      <span className="text-[12px] font-mono font-semibold text-[#1a1550]/35">
                        {String(globalIndex + 1).padStart(2, "0")}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold"
                          style={{ background: av.bg, color: av.text }}
                        >
                          {initials(staff.name)}
                        </div>
                        <span className="font-semibold text-[#1a1550] text-[14px]">
                          {getName(staff)}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold"
                        style={getBadgeStyle(staff.designation)}
                      >
                        {getDesignation(staff)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[13px] text-[#1a1550]/60">
                      {staff.cadre || (
                        <span className="text-[#1a1550]/25 italic text-[12px]">
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {staff.email ? (
                        <a
                          href={`mailto:${staff.email}`}
                          className="text-[13px] text-[#1077A6] hover:underline underline-offset-2"
                        >
                          {staff.email}
                        </a>
                      ) : (
                        <span className="text-[#1a1550]/25 italic text-[12px]">
                          —
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {members.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-3 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "#1077A610" }}
            >
              <Search className="w-5 h-5 text-[#1077A6]/50" />
            </div>
            <p className="text-[#1a1550]/50 text-[14px]">{noResultsLabel}</p>
            {query && (
              <button
                onClick={onClearQuery}
                className="text-[13px] font-semibold text-[#1077A6] hover:underline"
              >
                {clearLabel}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="md:hidden space-y-3">
        {paginated.map((staff, i) => {
          const av = avatarBg(i);
          const globalIndex = (page - 1) * pageSize + i;
          return (
            <motion.div
              key={staff.id}
              custom={i}
              variants={rowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10px" }}
              className="bg-white rounded-xl border border-[#1077A6]/10 p-4 flex items-start gap-4"
            >
              <div
                className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold"
                style={{ background: av.bg, color: av.text }}
              >
                {initials(staff.name)}
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="font-semibold text-[#1a1550] text-[14px] leading-tight">
                  {getName(staff)}
                </p>
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={getBadgeStyle(staff.designation)}
                >
                  {getDesignation(staff)}
                </span>
                {staff.cadre && (
                  <p className="text-[12px] text-[#1a1550]/50">
                    <span className="font-medium text-[#1a1550]/40">
                      Cadre:{" "}
                    </span>
                    {staff.cadre}
                  </p>
                )}
                {staff.email && (
                  <a
                    href={`mailto:${staff.email}`}
                    className="block text-[12px] text-[#1077A6] hover:underline underline-offset-2 truncate"
                  >
                    {staff.email}
                  </a>
                )}
              </div>

              <span className="flex-shrink-0 text-[11px] font-mono text-[#1a1550]/25 mt-0.5">
                {String(globalIndex + 1).padStart(2, "0")}
              </span>
            </motion.div>
          );
        })}

        {members.length === 0 && (
          <div className="py-14 flex flex-col items-center gap-3 text-center">
            <p className="text-[#1a1550]/50 text-[14px]">{noResultsLabel}</p>
            {query && (
              <button
                onClick={onClearQuery}
                className="text-[13px] font-semibold text-[#1077A6] hover:underline"
              >
                {clearLabel}
              </button>
            )}
          </div>
        )}
      </div>

      {members.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <p className="text-[12px] text-[#1a1550]/40">
              Showing{" "}
              <span className="font-semibold text-[#1a1550]/70">
                {(page - 1) * pageSize + 1}
              </span>{" "}
              –{" "}
              <span className="font-semibold text-[#1a1550]/70">
                {Math.min(page * pageSize, members.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#1a1550]/70">
                {members.length}
              </span>
            </p>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="text-[11px] text-[#1a1550] border border-[#1077A6]/15 rounded-lg px-2 py-1 bg-white outline-none focus:border-[#1077A6]/40 cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s} / page
                </option>
              ))}
            </select>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1077A6]/15 text-[#1077A6] hover:bg-[#1077A6]/8 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-[12px] text-[#1a1550]/30"
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-semibold transition-all ${
                      page === p
                        ? "bg-[#1077A6] text-white shadow-sm"
                        : "border border-[#1077A6]/15 text-[#1a1550]/60 hover:bg-[#1077A6]/8 hover:text-[#1077A6]"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1077A6]/15 text-[#1077A6] hover:bg-[#1077A6]/8 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
