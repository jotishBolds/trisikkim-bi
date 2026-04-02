"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Save,
  X,
  Newspaper,
  Loader2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ImageUpload from "@/components/admin/ImageUpload";
import Image from "next/image";

const RichEditor = dynamic(() => import("@/components/admin/RichEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-[#1077a6]/[0.12] rounded-lg p-3 text-xs text-[#1a1550]/25">
      Loading editor...
    </div>
  ),
});

const CATEGORIES = [
  { value: "news-events", label: "News and Events" },
  { value: "training-workshop", label: "Training & Workshop" },
  { value: "activities", label: "Activities" },
  { value: "circulars", label: "Circulars & Notifications" },
  { value: "publications", label: "Publications" },
];

interface UpdateItem {
  id: number;
  category: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  pdfUrl: string | null;
  publishedAt: string;
  active: boolean;
}

const inputCls =
  "h-9 text-xs border-[#1077a6]/[0.15] rounded-lg focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20";
const labelCls = "text-[11px] font-medium text-[#1a1550]/40 mb-1 block";
const selectCls =
  "h-9 text-xs border border-[#1077a6]/[0.15] rounded-lg px-3 bg-white focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] outline-none";

export default function UpdatesAdmin() {
  const [items, setItems] = useState<UpdateItem[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Partial<UpdateItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      const url = filterCat
        ? `/api/updates?category=${filterCat}&includeInactive=true`
        : "/api/updates?includeInactive=true";
      const r = await fetch(url);
      const d = await r.json();
      if (d.success) setItems(d.data);
      else setError(d.error);
    } catch {
      setError("Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [filterCat]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const slugify = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleSave = async () => {
    if (!editing) return;
    setError("");
    setSaving(true);
    try {
      const isNew = !editing.id;
      const payload = {
        ...editing,
        slug: editing.slug || slugify(editing.title || ""),
      };
      const r = await fetch(
        isNew ? "/api/updates" : `/api/updates/${editing.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const d = await r.json();
      if (d.success) {
        setEditing(null);
        fetchItems();
      } else setError(d.error);
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    try {
      const r = await fetch(`/api/updates/${id}`, { method: "DELETE" });
      const d = await r.json();
      if (d.success) fetchItems();
      else setError(d.error);
    } catch {
      setError("Failed to delete.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 text-[#1077a6] animate-spin" />
      </div>
    );

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 bg-red-50 text-red-600 rounded-lg p-2.5 text-xs border border-red-100"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Newspaper className="w-3.5 h-3.5 text-[#1077a6]" />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className={selectCls}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <Button
          size="sm"
          onClick={() =>
            setEditing({
              category: "news-events",
              title: "",
              slug: "",
              excerpt: "",
              content: "",
              image: "",
              pdfUrl: "",
              active: true,
            })
          }
          className="h-8 text-xs gap-1.5 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-lg"
        >
          <Plus className="w-3.5 h-3.5" /> Add Update
        </Button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <Card className="border-[#1077a6]/20 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <p className="text-sm font-bold text-[#1a1550]">
                  {editing.id ? "Edit" : "New"} Update
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Category</label>
                    <select
                      value={editing.category || "news-events"}
                      onChange={(e) => {
                        const newCategory = e.target.value;
                        const isPdfCategory =
                          newCategory === "circulars" ||
                          newCategory === "publications";
                        const wasPdfCategory =
                          editing.category === "circulars" ||
                          editing.category === "publications";

                        setEditing({
                          ...editing,
                          category: newCategory,
                          // Clear image when switching to PDF category
                          // Clear pdfUrl when switching to non-PDF category
                          image: isPdfCategory ? null : editing.image,
                          pdfUrl: isPdfCategory ? editing.pdfUrl : null,
                        });
                      }}
                      className={`w-full ${selectCls}`}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Title</label>
                    <Input
                      value={editing.title || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          title: e.target.value,
                          slug: editing.id
                            ? editing.slug
                            : slugify(e.target.value),
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Slug</label>
                    <Input
                      value={editing.slug || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, slug: e.target.value })
                      }
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Published Date</label>
                    <Input
                      type="datetime-local"
                      value={
                        editing.publishedAt
                          ? new Date(editing.publishedAt)
                              .toISOString()
                              .slice(0, 16)
                          : new Date().toISOString().slice(0, 16)
                      }
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          publishedAt: new Date(e.target.value).toISOString(),
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>
                {editing.category === "circulars" ||
                editing.category === "publications" ? (
                  <ImageUpload
                    value={editing.pdfUrl || ""}
                    onChange={(url) =>
                      setEditing({ ...editing, pdfUrl: url, image: null })
                    }
                    label="PDF Document"
                    endpoint="pdfUploader"
                    fileType="pdf"
                  />
                ) : (
                  <ImageUpload
                    value={editing.image || ""}
                    onChange={(url) =>
                      setEditing({ ...editing, image: url, pdfUrl: null })
                    }
                    label="Featured Image"
                    endpoint="imageUploader"
                    fileType="image"
                  />
                )}
                <div>
                  <label className={labelCls}>Excerpt</label>
                  <textarea
                    value={editing.excerpt || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, excerpt: e.target.value })
                    }
                    rows={2}
                    placeholder="Brief summary"
                    className={`w-full resize-none ${inputCls} py-2 px-3 h-auto`}
                  />
                </div>
                <RichEditor
                  content={editing.content || ""}
                  onChange={(html) => setEditing({ ...editing, content: html })}
                  label="Content"
                  placeholder="Write the full content..."
                />
                <label className="flex items-center gap-2 text-xs text-[#1a1550]">
                  <input
                    type="checkbox"
                    checked={editing.active ?? true}
                    onChange={(e) =>
                      setEditing({ ...editing, active: e.target.checked })
                    }
                    className="w-3.5 h-3.5 accent-[#1077a6]"
                  />
                  Active
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                    className="h-8 text-xs gap-1.5 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-lg"
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}{" "}
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(null)}
                    className="h-8 text-xs gap-1.5 rounded-lg border-[#1077a6]/20"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-lg border border-[#1077a6]/[0.12] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#1077a6] text-white">
                <th className="px-3 py-2.5 text-left font-semibold">Image</th>
                <th className="px-3 py-2.5 text-left font-semibold">Title</th>
                <th className="px-3 py-2.5 text-left font-semibold hidden md:table-cell">
                  Category
                </th>
                <th className="px-3 py-2.5 text-left font-semibold hidden sm:table-cell">
                  Date
                </th>
                <th className="px-3 py-2.5 text-left font-semibold hidden sm:table-cell">
                  Active
                </th>
                <th className="px-3 py-2.5 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-t border-[#1077a6]/[0.06] hover:bg-[#1077a6]/[0.02]"
                >
                  <td className="px-3 py-2.5">
                    {item.image ? (
                      item.category === "circulars" ? (
                        <div className="w-10 h-7 rounded bg-red-50 border border-red-100 flex items-center justify-center">
                          <FileText className="w-3 h-3 text-red-400" />
                        </div>
                      ) : (
                        <div className="relative w-10 h-7 rounded overflow-hidden bg-[#1077a6]/[0.05]">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )
                    ) : (
                      <div className="w-10 h-7 rounded bg-[#1077a6]/[0.08] flex items-center justify-center">
                        <Newspaper className="w-3 h-3 text-[#1077a6]/40" />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="font-semibold text-[#1a1550] truncate max-w-[160px]">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-[#1a1550]/40 md:hidden capitalize">
                      {item.category.replace("-", " ")}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 hidden md:table-cell">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#1077a6]/[0.08] text-[#1077a6] capitalize">
                      {item.category.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[#1a1550]/40 hidden sm:table-cell">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2.5 hidden sm:table-cell">
                    <span
                      className={`w-2 h-2 rounded-full inline-block ${item.active ? "bg-emerald-400" : "bg-[#1a1550]/15"}`}
                    />
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditing(item)}
                        className="p-1.5 rounded-md hover:bg-[#1077a6]/10 text-[#1077a6]"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-10 text-center text-[#1a1550]/25"
                  >
                    No updates yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
