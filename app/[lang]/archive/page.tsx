"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  FolderArchive,
  Filter,
  Search,
  AlertCircle,
  ArrowLeft,
  Tag,
  Clock,
  X,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n/use-translation";

const PdfViewer = dynamic(() => import("@/components/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-8">Loading PDF...</div>
  ),
});

interface Archive {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  pdfUrl: string;
  publishedAt: string;
  translations?: {
    hi?: {
      title?: string;
      description?: string;
      category?: string;
    };
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "Annual Report": "bg-purple-100 text-purple-700",
  Circular: "bg-blue-100 text-blue-700",
  Notification: "bg-amber-100 text-amber-700",
  Report: "bg-green-100 text-green-700",
  Policy: "bg-rose-100 text-rose-700",
  Minutes: "bg-cyan-100 text-cyan-700",
  default: "bg-[#1A3A6B]/8 text-[#1A3A6B]/70",
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#1077A6]/8 animate-pulse">
      <div className="h-48 bg-[#1077A6]/8 flex items-center justify-center">
        <FileText className="w-12 h-12 text-[#1077A6]/10" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 bg-[#1077A6]/10 rounded-full" />
        <div className="h-5 w-4/5 bg-[#1a1550]/10 rounded-full" />
        <div className="h-4 w-full bg-[#1a1550]/8 rounded-full" />
        <div className="h-4 w-3/4 bg-[#1a1550]/8 rounded-full" />
      </div>
    </div>
  );
}

function ArchiveCard({
  item,
  index,
  onClick,
  lang,
  viewDocumentLabel,
}: {
  item: Archive;
  index: number;
  onClick: () => void;
  lang: string;
  viewDocumentLabel: string;
}) {
  const tr = lang !== "en" ? item.translations?.hi : null;
  const title = tr?.title || item.title;
  const description = tr?.description || item.description;
  const category = tr?.category || item.category;
  const badgeClass = item.category
    ? CATEGORY_COLORS[item.category] || CATEGORY_COLORS["default"]
    : CATEGORY_COLORS["default"];

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-[#1077A6]/10 hover:border-[#f4c430]/40 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative h-48 bg-gradient-to-br from-red-50 to-red-100/50 overflow-hidden flex-shrink-0">
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative">
            <FileText className="w-16 h-16 text-red-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">PDF</span>
            </div>
          </div>
        </div>
        {category && (
          <span
            className={`absolute top-3 left-3 text-[11px] font-bold uppercase tracking-[.12em] px-2.5 py-1 rounded-full ${badgeClass}`}
          >
            {category}
          </span>
        )}
        <div className="absolute top-3 right-3 text-[11px] font-medium text-[#1a1550]/40 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(item.publishedAt).getFullYear()}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[11px] text-[#1a1550]/40 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(item.publishedAt).toLocaleDateString(
              lang === "hi" ? "hi-IN" : "en-IN",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              },
            )}
          </span>
        </div>
        <h3 className="font-display font-bold text-[#1a1550] text-[16px] leading-snug mb-2 line-clamp-2 group-hover:text-[#1077A6] transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-[#1a1550]/55 text-[13.5px] leading-relaxed line-clamp-3 flex-1">
            {description}
          </p>
        )}
        <div className="mt-4 pt-4 border-t border-[#1077A6]/8">
          <span className="text-[12px] font-semibold text-[#1077A6] group-hover:text-[#f4c430] transition-colors">
            {viewDocumentLabel} →
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function DetailView({
  item,
  onBack,
  backLabel,
  publishedLabel,
  lang,
}: {
  item: Archive;
  onBack: () => void;
  backLabel: string;
  publishedLabel: string;
  lang: string;
}) {
  const tr = lang !== "en" ? item.translations?.hi : null;
  const title = tr?.title || item.title;
  const description = tr?.description || item.description;
  const category = tr?.category || item.category;
  const badgeClass = item.category
    ? CATEGORY_COLORS[item.category] || CATEGORY_COLORS["default"]
    : CATEGORY_COLORS["default"];

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35 }}
      className="min-h-[60vh]"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8 pb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1077A6] text-[13px] font-semibold hover:text-[#f4c430] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {backLabel}
        </button>
      </div>

      <article className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
        <div className="mt-6 mb-4 flex flex-wrap items-center gap-3">
          {category && (
            <span
              className={`text-[11px] font-bold uppercase tracking-[.12em] px-2.5 py-1 rounded-full ${badgeClass}`}
            >
              <Tag className="w-3 h-3 inline mr-1" />
              {category}
            </span>
          )}
          <span className="flex items-center gap-1 text-[12px] text-[#1a1550]/45">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(item.publishedAt).toLocaleDateString(
              lang === "hi" ? "hi-IN" : "en-IN",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              },
            )}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-[#1a1550]/45">
            <FileText className="w-3.5 h-3.5" />
            PDF Document
          </span>
        </div>

        <h1 className="font-display font-bold text-[#1a1550] text-[clamp(22px,3.5vw,36px)] leading-tight mb-4">
          {title}
        </h1>

        {description && (
          <p className="text-[#1a1550]/60 text-[16px] leading-relaxed mb-6 border-l-4 border-[#f4c430] pl-4 italic">
            {description}
          </p>
        )}

        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-[#1077A6]/10" />
          <div className="w-2 h-2 rounded-full bg-[#f4c430]" />
          <div className="h-px flex-1 bg-[#1077A6]/10" />
        </div>

        {item.pdfUrl && (
          <div className="mb-8">
            <PdfViewer fileUrl={item.pdfUrl} />
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-[#1077A6]/10 flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#1077A6] text-[13px] font-semibold hover:text-[#f4c430] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {backLabel}
          </button>
          <span className="text-[12px] text-[#1a1550]/35">
            {publishedLabel}{" "}
            {new Date(item.publishedAt).toLocaleDateString(
              lang === "hi" ? "hi-IN" : "en-IN",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              },
            )}
          </span>
        </div>
      </article>
    </motion.div>
  );
}

export default function ArchivePage() {
  const { lang } = useTranslation();
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Archive | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Translations
  const t = {
    title: lang === "hi" ? "संग्रह" : "Archive",
    caption:
      lang === "hi"
        ? "ऐतिहासिक रिकॉर्ड, परिपत्र, रिपोर्ट और महत्वपूर्ण दस्तावेजों तक पहुंचें"
        : "Access historical records, circulars, reports, and important documents",
    filterSearch: lang === "hi" ? "फ़िल्टर और खोज" : "Filter & Search",
    searchPlaceholder:
      lang === "hi" ? "दस्तावेज़ खोजें..." : "Search documents...",
    allCategories: lang === "hi" ? "सभी श्रेणियां" : "All Categories",
    allYears: lang === "hi" ? "सभी वर्ष" : "All Years",
    clearFilters: lang === "hi" ? "फ़िल्टर साफ़ करें" : "Clear Filters",
    showing: lang === "hi" ? "दिखा रहे हैं" : "Showing",
    of: lang === "hi" ? "में से" : "of",
    documents: lang === "hi" ? "दस्तावेज़" : "documents",
    noDocuments:
      lang === "hi" ? "कोई दस्तावेज़ नहीं मिला" : "No documents found",
    noDocumentsDesc:
      lang === "hi"
        ? "कृपया अपने फ़िल्टर बदलकर पुनः प्रयास करें"
        : "Try adjusting your filters or search term",
    viewDocument: lang === "hi" ? "दस्तावेज़ देखें" : "View Document",
    backToArchive: lang === "hi" ? "संग्रह पर वापस जाएं" : "Back to Archive",
    published: lang === "hi" ? "प्रकाशित:" : "Published:",
    previous: lang === "hi" ? "पिछला" : "Previous",
    next: lang === "hi" ? "अगला" : "Next",
    found: lang === "hi" ? "मिले" : "found",
  };

  useEffect(() => {
    setLoading(true);
    fetch("/api/archives")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setArchives(d.data);
        else setError(d.error || "Failed to load archives");
      })
      .catch(() => setError("Failed to load archives."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selected) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selected]);

  const getTranslatedContent = (archive: Archive) => {
    if (lang === "hi" && archive.translations?.hi) {
      return {
        title: archive.translations.hi.title || archive.title,
        description: archive.translations.hi.description || archive.description,
        category: archive.translations.hi.category || archive.category,
      };
    }
    return {
      title: archive.title,
      description: archive.description,
      category: archive.category,
    };
  };

  const categories = Array.from(
    new Set(
      archives
        .map((a) => a.category)
        .filter((c): c is string => c !== null && c !== ""),
    ),
  );

  const years = Array.from(
    new Set(
      archives.map((a) => new Date(a.publishedAt).getFullYear().toString()),
    ),
  ).sort((a, b) => parseInt(b) - parseInt(a));

  const filteredArchives = archives.filter((archive) => {
    const content = getTranslatedContent(archive);
    const matchesCategory =
      selectedCategory === "all" || archive.category === selectedCategory;
    const matchesYear =
      selectedYear === "all" ||
      new Date(archive.publishedAt).getFullYear().toString() === selectedYear;
    const matchesSearch =
      searchTerm === "" ||
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesYear && matchesSearch;
  });

  const totalPages = Math.ceil(filteredArchives.length / ITEMS_PER_PAGE);
  const paginatedArchives = filteredArchives.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const selectedTr = lang !== "en" ? selected?.translations?.hi : null;
  const selectedTitle = selectedTr?.title || selected?.title || "";

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      <PageHero
        title={selected ? selectedTitle : t.title}
        caption={selected ? undefined : t.caption}
        icon={<FolderArchive className="w-3.5 h-3.5 text-[#f4c430]" />}
      />

      <AnimatePresence mode="wait">
        {selected ? (
          <DetailView
            key="detail"
            item={selected}
            onBack={() => setSelected(null)}
            backLabel={t.backToArchive}
            publishedLabel={t.published}
            lang={lang}
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12"
          >
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-lg p-4 mb-8 border border-red-200 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-[#1077A6]/10 p-4 md:p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-[#1077a6]" />
                <h2 className="text-sm font-semibold text-[#1a1550]">
                  {t.filterSearch}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A3A6B]/40" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="pl-9 h-10 text-sm border-[#1077A6]/15 focus:border-[#1077A6] rounded-lg"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A3A6B]/40 hover:text-[#1A3A6B]/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="h-10 text-sm border border-[#1077A6]/15 rounded-lg px-3 bg-white focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 outline-none text-[#1a1550]"
                >
                  <option value="all">{t.allCategories}</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setPage(1);
                  }}
                  className="h-10 text-sm border border-[#1077A6]/15 rounded-lg px-3 bg-white focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 outline-none text-[#1a1550]"
                >
                  <option value="all">{t.allYears}</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedYear("all");
                    setSearchTerm("");
                    setPage(1);
                  }}
                  className="h-10 border-[#1077A6]/15 text-[#1077A6] hover:bg-[#1077A6]/5"
                >
                  {t.clearFilters}
                </Button>
              </div>
            </div>

            {!loading && filteredArchives.length > 0 && (
              <p className="text-[13px] text-[#1a1550]/40 mb-6">
                {filteredArchives.length} {t.documents} {t.found}
              </p>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : paginatedArchives.length === 0 ? (
              <div className="text-center py-24">
                <FolderArchive className="w-14 h-14 text-[#1a1550]/10 mx-auto mb-4" />
                <p className="text-[#1a1550]/40 text-[15px] font-medium">
                  {t.noDocuments}
                </p>
                <p className="text-[#1a1550]/25 text-[13px] mt-1">
                  {t.noDocumentsDesc}
                </p>
              </div>
            ) : (
              /* Archive Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedArchives.map((item, i) => (
                  <ArchiveCard
                    key={item.id}
                    item={item}
                    index={i}
                    onClick={() => setSelected(item)}
                    lang={lang}
                    viewDocumentLabel={t.viewDocument}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-[#1077A6]/15 text-[#1077A6] hover:bg-[#1077A6]/5 disabled:opacity-50"
                >
                  {t.previous}
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          pageNum === page
                            ? "bg-[#1077a6] text-white shadow-sm"
                            : "bg-white border border-[#1077A6]/15 text-[#1a1550] hover:bg-[#1077A6]/5"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-[#1077A6]/15 text-[#1077A6] hover:bg-[#1077A6]/5 disabled:opacity-50"
                >
                  {t.next}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
