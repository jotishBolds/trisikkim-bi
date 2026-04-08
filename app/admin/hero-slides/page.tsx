// components/admin/HeroSlidesAdmin.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ImageUpload from "@/components/admin/ImageUpload";
import Image from "next/image";

interface HeroSlide {
  id: number;
  image: string;
  headline: string;
  caption: string; // NEW
  sortOrder: number;
  active: boolean;
}

const EMPTY: Omit<HeroSlide, "id"> = {
  image: "",
  headline: "",
  caption: "", // NEW
  sortOrder: 0,
  active: true,
};

const inputCls =
  "h-9 text-xs border-[#1077a6]/[0.15] rounded-lg focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20";
const labelCls = "text-[11px] font-medium text-[#1a1550]/40 mb-1 block";

export default function HeroSlidesAdmin() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Partial<HeroSlide> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSlides = useCallback(async () => {
    try {
      const res = await fetch("/api/hero-slides");
      const data = await res.json();
      if (data.success) setSlides(data.data);
      else setError(data.error);
    } catch {
      setError("Failed to load slides.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const handleSave = async () => {
    if (!editing) return;

    // Validation: Minimum 100 characters for caption
    if (editing.caption && editing.caption.trim().length < 100) {
      setError("Caption must be at least 100 characters long.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch(
        isNew ? "/api/hero-slides" : `/api/hero-slides/${editing.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        },
      );
      const data = await res.json();
      if (data.success) {
        setEditing(null);
        fetchSlides();
      } else setError(data.error);
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this slide?")) return;
    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchSlides();
      else setError(data.error);
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
          onClick={() => setEditing({ ...EMPTY })}
          className="h-8 text-xs gap-1.5 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-lg"
        >
          <Plus className="w-3.5 h-3.5" /> Add Slide
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
                  {editing.id ? "Edit Slide" : "New Slide"}
                </p>

                <ImageUpload
                  value={editing.image || ""}
                  onChange={(url) => setEditing({ ...editing, image: url })}
                  label="Background Image"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Page Title</label>
                    <textarea
                      value={editing.headline || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, headline: e.target.value })
                      }
                      rows={2}
                      placeholder="Enter page title (use line break for accent color on second line)"
                      className={`w-full resize-none ${inputCls} py-2 px-3 h-auto`}
                    />
                    <p className="text-[10px] text-[#1a1550]/30 mt-1">
                      Tip: Second line will be highlighted in accent color
                    </p>
                  </div>

                  {/* NEW: Caption field */}
                  <div className="sm:col-span-2">
                    <label className={labelCls}>
                      Caption <span className="text-red-500">*</span>{" "}
                      <span className="text-[10px] font-normal">
                        (min. 100 characters)
                      </span>
                    </label>
                    <textarea
                      value={editing.caption || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, caption: e.target.value })
                      }
                      rows={4}
                      placeholder="Enter descriptive caption for this slide (minimum 100 characters required)"
                      className={`w-full resize-none ${inputCls} py-2 px-3 h-auto ${
                        editing.caption && editing.caption.length < 100
                          ? "border-red-300 focus:border-red-400"
                          : ""
                      }`}
                    />
                    <div className="flex items-center justify-between mt-1">
                      <p
                        className={`text-[10px] ${
                          editing.caption && editing.caption.length < 100
                            ? "text-red-500"
                            : "text-[#1a1550]/30"
                        }`}
                      >
                        {editing.caption?.length || 0} / 100 characters{" "}
                        {editing.caption && editing.caption.length < 100 && (
                          <span className="font-medium">
                            ({100 - (editing.caption?.length || 0)} more
                            required)
                          </span>
                        )}
                      </p>
                      {editing.caption && editing.caption.length >= 100 && (
                        <span className="text-[10px] text-emerald-600">
                          ✓ Valid
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#1a1550]/30 mt-1">
                      This text will appear as an overlay on the slide image.
                      Leave empty for no caption overlay.
                    </p>
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

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-xs text-[#1a1550] pb-2">
                      <input
                        type="checkbox"
                        checked={editing.active ?? true}
                        onChange={(e) =>
                          setEditing({ ...editing, active: e.target.checked })
                        }
                        className="w-3.5 h-3.5 rounded accent-[#1077a6]"
                      />
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={
                      saving ||
                      (editing.caption ? editing.caption.length < 100 : false)
                    }
                    className="h-8 text-xs gap-1.5 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-lg disabled:opacity-50"
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
                <th className="px-3 py-2.5 text-left font-semibold">#</th>
                <th className="px-3 py-2.5 text-left font-semibold">Image</th>
                <th className="px-3 py-2.5 text-left font-semibold">Title</th>
                <th className="px-3 py-2.5 text-left font-semibold hidden md:table-cell">
                  Caption
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
              {slides.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-[#1077a6]/[0.06] hover:bg-[#1077a6]/[0.02]"
                >
                  <td className="px-3 py-2.5 text-[#1a1550]/30">
                    {s.sortOrder}
                  </td>
                  <td className="px-3 py-2.5">
                    {s.image ? (
                      <div className="relative w-12 h-8 rounded overflow-hidden bg-[#1077a6]/[0.05]">
                        <Image
                          src={s.image}
                          alt={s.headline}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#1a1550]/20">
                        No image
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="font-semibold text-[#1a1550] truncate max-w-[200px]">
                      {s.headline.replace("\n", " ")}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 hidden md:table-cell">
                    <p className="text-[#1a1550]/60 truncate max-w-[250px] text-[11px]">
                      {s.caption || (
                        <span className="text-[#1a1550]/20 italic">
                          No caption
                        </span>
                      )}
                    </p>
                    {s.caption && (
                      <span className="text-[9px] text-[#1a1550]/30">
                        {s.caption.length} chars
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 hidden sm:table-cell">
                    <span
                      className={`w-2 h-2 rounded-full inline-block ${s.active ? "bg-emerald-400" : "bg-[#1a1550]/15"}`}
                    />
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditing(s)}
                        className="p-1.5 rounded-md hover:bg-[#1077a6]/10 text-[#1077a6]"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {slides.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-10 text-center text-[#1a1550]/25"
                  >
                    No slides yet.
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
