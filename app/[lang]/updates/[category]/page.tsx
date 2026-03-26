"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Tag,
  Clock,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

interface UpdateTranslations {
  hi?: { title?: string; excerpt?: string; content?: string };
}

interface UpdateItem {
  id: number;
  category: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  publishedAt: string;
  translations?: UpdateTranslations | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  "training-workshop": "bg-purple-100 text-purple-700",
  "news-events": "bg-blue-100 text-blue-700",
  activities: "bg-green-100 text-green-700",
  circulars: "bg-amber-100 text-amber-700",
};

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#1077A6]/8 animate-pulse">
      <div className="h-48 bg-[#1077A6]/8" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 bg-[#1077A6]/10 rounded-full" />
        <div className="h-5 w-4/5 bg-[#1a1550]/10 rounded-full" />
        <div className="h-4 w-full bg-[#1a1550]/8 rounded-full" />
        <div className="h-4 w-3/4 bg-[#1a1550]/8 rounded-full" />
      </div>
    </div>
  );
}

/* ── Card component ── */
function UpdateCard({
  item,
  index,
  onClick,
  categoryLabel,
  readTimeLabel,
  lang,
  readFullLabel,
}: {
  item: UpdateItem;
  index: number;
  onClick: () => void;
  categoryLabel: string;
  readTimeLabel: string;
  lang: string;
  readFullLabel: string;
}) {
  const badgeClass =
    CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600";

  const words = item.content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));

  const tr = lang !== "en" ? item.translations?.hi : null;
  const tTitle = tr?.title || item.title;
  const tExcerpt = tr?.excerpt || item.excerpt || "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-[#1077A6]/10 hover:border-[#f4c430]/40 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative h-48 bg-gradient-to-br from-[#1077A6]/10 to-[#1a1550]/10 overflow-hidden flex-shrink-0">
        {item.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="w-10 h-10 text-[#1077A6]/20" />
          </div>
        )}
        <span
          className={`absolute top-3 left-3 text-[11px] font-bold uppercase tracking-[.12em] px-2.5 py-1 rounded-full ${badgeClass}`}
        >
          {categoryLabel}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[11px] text-[#1a1550]/40 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(item.publishedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {mins} {readTimeLabel}
          </span>
        </div>

        <h3 className="font-display font-bold text-[#1a1550] text-[16px] leading-snug mb-2 line-clamp-2 group-hover:text-[#1077A6] transition-colors">
          {tTitle}
        </h3>

        {item.excerpt && (
          <p className="text-[#1a1550]/55 text-[13.5px] leading-relaxed line-clamp-3 flex-1">
            {tExcerpt}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-[#1077A6]/8 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[#1077A6] group-hover:text-[#f4c430] transition-colors">
            {readFullLabel} →
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Detail view ── */
function DetailView({
  item,
  label,
  onBack,
  categoryLabel,
  readTimeLabel,
  publishedLabel,
  lang,
}: {
  item: UpdateItem;
  label: string;
  onBack: () => void;
  categoryLabel: string;
  readTimeLabel: string;
  publishedLabel: string;
  lang: string;
}) {
  const badgeClass =
    CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600";

  const words = item.content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));

  const tr = lang !== "en" ? item.translations?.hi : null;
  const tTitle = tr?.title || item.title;
  const tExcerpt = tr?.excerpt || item.excerpt || "";
  const tContent = tr?.content || item.content;

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
          ← {label}
        </button>
      </div>

      <article className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
        <div className="mt-6 mb-4 flex flex-wrap items-center gap-3">
          <span
            className={`text-[11px] font-bold uppercase tracking-[.12em] px-2.5 py-1 rounded-full ${badgeClass}`}
          >
            <Tag className="w-3 h-3 inline mr-1" />
            {categoryLabel}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-[#1a1550]/45">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(item.publishedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-[#1a1550]/45">
            <Clock className="w-3.5 h-3.5" />
            {mins} {readTimeLabel}
          </span>
        </div>

        <h1 className="font-display font-bold text-[#1a1550] text-[clamp(22px,3.5vw,36px)] leading-tight mb-4">
          {tTitle}
        </h1>

        {item.excerpt && (
          <p className="text-[#1a1550]/60 text-[16px] leading-relaxed mb-6 border-l-4 border-[#f4c430] pl-4 italic">
            {tExcerpt}
          </p>
        )}

        {item.image && (
          <div className="rounded-2xl overflow-hidden mb-8 border border-[#1077A6]/10 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full max-h-[420px] object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-[#1077A6]/10" />
          <div className="w-2 h-2 rounded-full bg-[#f4c430]" />
          <div className="h-px flex-1 bg-[#1077A6]/10" />
        </div>

        <div
          className="prose prose-base max-w-none
            text-[#1a1550]/80
            prose-headings:text-[#1a1550] prose-headings:font-display
            prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
            prose-a:text-[#1077A6] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#1a1550]
            prose-img:rounded-xl prose-img:shadow-md prose-img:border prose-img:border-[#1077A6]/10
            prose-blockquote:border-[#f4c430] prose-blockquote:bg-[#f4c430]/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
            prose-ul:text-[#1a1550]/75 prose-ol:text-[#1a1550]/75
            prose-code:bg-[#1077A6]/8 prose-code:px-1.5 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: tContent }}
        />

        <div className="mt-10 pt-6 border-t border-[#1077A6]/10 flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#1077A6] text-[13px] font-semibold hover:text-[#f4c430] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            ← {label}
          </button>
          <span className="text-[12px] text-[#1a1550]/35">
            {publishedLabel}{" "}
            {new Date(item.publishedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </article>
    </motion.div>
  );
}

/* ── Main page ── */
export default function UpdatesCategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const { lang, dict } = useTranslation();
  const [items, setItems] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<UpdateItem | null>(null);

  const catKey = category as keyof typeof dict.updates.categories;
  const label = dict.updates.categories[catKey] || category;
  const readTimeLabel = dict.updates.readTime;
  const publishedLabel = dict.updates.published;
  const readFullLabel = dict.updates.readFullUpdate;
  const selectedTr = lang !== "en" ? selected?.translations?.hi : null;
  const selectedTitle = selectedTr?.title || selected?.title || "";

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    fetch(`/api/updates?category=${encodeURIComponent(category)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setItems(d.data);
        else setError(d.error);
      })
      .catch(() => setError("Failed to load updates."))
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    if (selected) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selected]);

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
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-[#f4c430]/15 flex items-center justify-center">
                <Newspaper className="w-3.5 h-3.5 text-[#f4c430]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#f4c430]">
                {dict.nav.updates}
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-[clamp(26px,4vw,44px)] leading-tight tracking-tight mb-3">
              {selected ? selectedTitle : label}
            </h1>
            {!selected && (
              <p className="text-white/55 text-[15px] max-w-xl leading-relaxed">
                {dict.updates.latestFrom}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selected ? (
          <DetailView
            key="detail"
            item={selected}
            label={label}
            onBack={() => setSelected(null)}
            categoryLabel={label}
            readTimeLabel={readTimeLabel}
            publishedLabel={publishedLabel}
            lang={lang}
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-7xl mx-auto px-4 md:px-8 py-12"
          >
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-lg p-4 mb-8 border border-red-200 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            {!loading && items.length > 0 && (
              <p className="text-[13px] text-[#1a1550]/40 mb-6">
                {items.length} update{items.length !== 1 ? "s" : ""} found
              </p>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-24">
                <Newspaper className="w-14 h-14 text-[#1a1550]/10 mx-auto mb-4" />
                <p className="text-[#1a1550]/40 text-[15px] font-medium">
                  {dict.updates.noUpdates}
                </p>
                <p className="text-[#1a1550]/25 text-[13px] mt-1">
                  {dict.updates.noUpdatesDesc}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, i) => (
                  <UpdateCard
                    key={item.id}
                    item={item}
                    index={i}
                    onClick={() => setSelected(item)}
                    categoryLabel={label}
                    readTimeLabel={readTimeLabel}
                    lang={lang}
                    readFullLabel={readFullLabel}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
