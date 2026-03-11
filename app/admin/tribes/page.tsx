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
  Images,
  Loader2,
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

interface TribeItem {
  id: string;
  name: string;
  image: string;
  excerpt: string;
  content: string;
  accent: string;
  heroImage: string;
  gallery: Array<{ url: string; label: string }>;
  sortOrder: number;
  active: boolean;
}

const inputCls =
  "h-9 text-xs border-[#1077a6]/[0.15] rounded-lg focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20";
const labelCls = "text-[11px] font-medium text-[#1a1550]/40 mb-1 block";

export default function TribesAdmin() {
  const [items, setItems] = useState<TribeItem[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Partial<TribeItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch_ = useCallback(async () => {
    try {
      const r = await fetch("/api/tribes");
      const d = await r.json();
      if (d.success) setItems(d.data);
      else setError(d.error);
    } catch {
      setError("Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  const handleSave = async () => {
    if (!editing) return;
    setError("");
    setSaving(true);
    try {
      const isNew = !items.find((i) => i.id === editing.id);
      const r = await fetch(
        isNew ? "/api/tribes" : `/api/tribes/${editing.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        },
      );
      const d = await r.json();
      if (d.success) {
        setEditing(null);
        fetch_();
      } else setError(d.error);
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try {
      const r = await fetch(`/api/tribes/${id}`, { method: "DELETE" });
      const d = await r.json();
      if (d.success) fetch_();
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

      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() =>
            setEditing({
              id: "",
              name: "",
              image: "",
              excerpt: "",
              content: "",
              accent: "#4fd1c5",
              heroImage: "",
              gallery: [],
              sortOrder: 0,
              active: true,
            })
          }
          className="h-8 text-xs gap-1.5 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-lg"
        >
          <Plus className="w-3.5 h-3.5" /> Add Tribe
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
                  {items.find((i) => i.id === editing.id) ? "Edit" : "New"}{" "}
                  Tribe
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ImageUpload
                    value={editing.image || ""}
                    onChange={(url) => setEditing({ ...editing, image: url })}
                    label="Thumbnail"
                  />
                  <ImageUpload
                    value={editing.heroImage || ""}
                    onChange={(url) =>
                      setEditing({ ...editing, heroImage: url })
                    }
                    label="Hero Banner"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>ID (slug)</label>
                    <Input
                      value={editing.id || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, id: e.target.value })
                      }
                      disabled={!!items.find((i) => i.id === editing.id)}
                      className={`${inputCls} disabled:opacity-40`}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Name</label>
                    <Input
                      value={editing.name || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Accent Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={editing.accent || "#4fd1c5"}
                        onChange={(e) =>
                          setEditing({ ...editing, accent: e.target.value })
                        }
                        className="w-9 h-9 rounded-md border border-[#1077a6]/[0.15] cursor-pointer"
                      />
                      <Input
                        value={editing.accent || "#4fd1c5"}
                        onChange={(e) =>
                          setEditing({ ...editing, accent: e.target.value })
                        }
                        className={`${inputCls} flex-1`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Sort Order</label>
                    <Input
                      type="number"
                      value={editing.sortOrder || 0}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          sortOrder: parseInt(e.target.value) || 0,
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Short Excerpt</label>
                  <textarea
                    value={editing.excerpt || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, excerpt: e.target.value })
                    }
                    rows={2}
                    className={`w-full resize-none ${inputCls} py-2 px-3 h-auto`}
                  />
                </div>

                <RichEditor
                  content={editing.content || ""}
                  onChange={(html) => setEditing({ ...editing, content: html })}
                  label="Full Content"
                  placeholder="Write about this tribe..."
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium text-[#1a1550]/40 flex items-center gap-1">
                      <Images className="w-3 h-3" /> Gallery
                    </span>
                    <button
                      onClick={() =>
                        setEditing({
                          ...editing,
                          gallery: [
                            ...(editing.gallery ?? []),
                            { url: "", label: "" },
                          ],
                        })
                      }
                      className="text-[10px] font-semibold text-[#1077a6] hover:text-[#f4c430] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Image
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(editing.gallery ?? []).map((g, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row gap-2 p-2.5 rounded-lg border border-[#1077a6]/[0.08] bg-[#1077a6]/[0.02]"
                      >
                        <div className="w-full sm:w-36 shrink-0">
                          <ImageUpload
                            value={g.url}
                            onChange={(url) => {
                              const arr = [...(editing.gallery ?? [])];
                              arr[idx] = { ...arr[idx], url };
                              setEditing({ ...editing, gallery: arr });
                            }}
                            label=""
                            endpoint="galleryUploader"
                          />
                        </div>
                        <div className="flex flex-1 min-w-0 gap-2 items-start">
                          <div className="flex-1">
                            <label className={labelCls}>Label</label>
                            <Input
                              value={g.label}
                              onChange={(e) => {
                                const arr = [...(editing.gallery ?? [])];
                                arr[idx] = {
                                  ...arr[idx],
                                  label: e.target.value,
                                };
                                setEditing({ ...editing, gallery: arr });
                              }}
                              className={`${inputCls} h-8`}
                            />
                          </div>
                          <button
                            onClick={() => {
                              const arr = (editing.gallery ?? []).filter(
                                (_, i) => i !== idx,
                              );
                              setEditing({ ...editing, gallery: arr });
                            }}
                            className="mt-5 p-1 rounded-md hover:bg-red-50 text-red-400 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(editing.gallery ?? []).length === 0 && (
                      <p className="text-[10px] text-[#1a1550]/20 italic">
                        No gallery images yet.
                      </p>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-[#1a1550]">
                  <input
                    type="checkbox"
                    checked={editing.active ?? true}
                    onChange={(e) =>
                      setEditing({ ...editing, active: e.target.checked })
                    }
                    className="w-3.5 h-3.5 accent-[#1077a6]"
                  />{" "}
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
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#1077a6] text-white">
              <th className="px-3 py-2.5 text-left font-semibold">Image</th>
              <th className="px-3 py-2.5 text-left font-semibold hidden sm:table-cell">
                ID
              </th>
              <th className="px-3 py-2.5 text-left font-semibold">Name</th>
              <th className="px-3 py-2.5 text-left font-semibold hidden sm:table-cell">
                Active
              </th>
              <th className="px-3 py-2.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-t border-[#1077a6]/[0.06] hover:bg-[#1077a6]/[0.02]"
              >
                <td className="px-3 py-2.5">
                  {item.image ? (
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-[#1077a6]/[0.05]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-[#1077a6]/[0.08] flex items-center justify-center text-[9px] font-bold text-[#1077a6]">
                      {item.name.charAt(0)}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2.5 font-mono text-[10px] text-[#1a1550]/40 hidden sm:table-cell">
                  {item.id}
                </td>
                <td className="px-3 py-2.5 font-semibold text-[#1a1550]">
                  {item.name}
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
                  colSpan={5}
                  className="px-3 py-10 text-center text-[#1a1550]/25"
                >
                  No tribes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
