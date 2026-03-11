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

interface UpdateItem {
  id: number;
  category: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  publishedAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  "training-workshop": "Training & Workshop",
  "news-events": "News and Events",
  activities: "Activities",
  circulars: "Circulars & Notifications",
};

const CATEGORY_COLORS: Record<string, string> = {
  "training-workshop": "bg-purple-100 text-purple-700",
  "news-events": "bg-blue-100 text-blue-700",
  activities: "bg-green-100 text-green-700",
  circulars: "bg-amber-100 text-amber-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function readTime(content: string) {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

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
}: {
  item: UpdateItem;
  index: number;
  onClick: () => void;
}) {
  const badgeClass =
    CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-[#1077A6]/10 hover:border-[#f4c430]/40 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Image */}
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
        {/* Category badge overlay */}
        <span
          className={`absolute top-3 left-3 text-[11px] font-bold uppercase tracking-[.12em] px-2.5 py-1 rounded-full ${badgeClass}`}
        >
          {CATEGORY_LABELS[item.category] ?? item.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[11px] text-[#1a1550]/40 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(item.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readTime(item.content)} min read
          </span>
        </div>

        <h3 className="font-display font-bold text-[#1a1550] text-[16px] leading-snug mb-2 line-clamp-2 group-hover:text-[#1077A6] transition-colors">
          {item.title}
        </h3>

        {item.excerpt && (
          <p className="text-[#1a1550]/55 text-[13.5px] leading-relaxed line-clamp-3 flex-1">
            {item.excerpt}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-[#1077A6]/8 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[#1077A6] group-hover:text-[#f4c430] transition-colors">
            Read full update →
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
}: {
  item: UpdateItem;
  label: string;
  onBack: () => void;
}) {
  const badgeClass =
    CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600";

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35 }}
      className="min-h-[60vh]"
    >
      {/* Back bar */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8 pb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1077A6] text-[13px] font-semibold hover:text-[#f4c430] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to {label}
        </button>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
        {/* Meta */}
        <div className="mt-6 mb-4 flex flex-wrap items-center gap-3">
          <span
            className={`text-[11px] font-bold uppercase tracking-[.12em] px-2.5 py-1 rounded-full ${badgeClass}`}
          >
            <Tag className="w-3 h-3 inline mr-1" />
            {CATEGORY_LABELS[item.category] ?? item.category}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-[#1a1550]/45">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(item.publishedAt)}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-[#1a1550]/45">
            <Clock className="w-3.5 h-3.5" />
            {readTime(item.content)} min read
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-bold text-[#1a1550] text-[clamp(22px,3.5vw,36px)] leading-tight mb-4">
          {item.title}
        </h1>

        {/* Excerpt */}
        {item.excerpt && (
          <p className="text-[#1a1550]/60 text-[16px] leading-relaxed mb-6 border-l-4 border-[#f4c430] pl-4 italic">
            {item.excerpt}
          </p>
        )}

        {/* Hero image */}
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

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-[#1077A6]/10" />
          <div className="w-2 h-2 rounded-full bg-[#f4c430]" />
          <div className="h-px flex-1 bg-[#1077A6]/10" />
        </div>

        {/* Content */}
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
          dangerouslySetInnerHTML={{ __html: item.content }}
        />

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-[#1077A6]/10 flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#1077A6] text-[13px] font-semibold hover:text-[#f4c430] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to {label}
          </button>
          <span className="text-[12px] text-[#1a1550]/35">
            Published {formatDate(item.publishedAt)}
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
  const [items, setItems] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<UpdateItem | null>(null);

  const label = CATEGORY_LABELS[category] || category;

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    fetch(`/api/updates?category=${category}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setItems(d.data);
        else setError(d.error);
      })
      .catch(() => setError("Failed to load updates."))
      .finally(() => setLoading(false));
  }, [category]);

  // Scroll to top when opening detail
  useEffect(() => {
    if (selected) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selected]);

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      {/* ── Hero banner (always visible) ── */}
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
                Updates
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-[clamp(26px,4vw,44px)] leading-tight tracking-tight mb-3">
              {selected ? selected.title : label}
            </h1>
            {!selected && (
              <p className="text-white/55 text-[15px] max-w-xl leading-relaxed">
                Latest {label.toLowerCase()} from the Tribal Research Institute
                &amp; Training Centre.
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <AnimatePresence mode="wait">
        {selected ? (
          <DetailView
            key="detail"
            item={selected}
            label={label}
            onBack={() => setSelected(null)}
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

            {/* Count */}
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
                  No updates available yet.
                </p>
                <p className="text-[#1a1550]/25 text-[13px] mt-1">
                  Check back soon for the latest {label.toLowerCase()}.
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
