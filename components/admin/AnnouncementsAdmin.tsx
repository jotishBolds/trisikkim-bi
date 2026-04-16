"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Save,
  X,
  Loader2,
  Megaphone,
  Link as LinkIcon,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface AnnouncementItem {
  id: number;
  title: string;
  link?: string | null;
  active: boolean;
  sortOrder: number;
  createdAt?: string;
}

const inputCls =
  "h-9 text-xs border-[#1077a6]/[0.15] rounded-lg focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20";
const labelCls = "text-[11px] font-medium text-[#1a1550]/40 mb-1 block";

export default function AnnouncementsAdmin() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Partial<AnnouncementItem> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/announcements");
      const d = await r.json();
      if (d.success) setItems(d.data);
      else setError(d.error || "Failed to load.");
    } catch {
      setError("Failed to connect.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleNew = () => {
    setEditing({ title: "", link: "", active: true, sortOrder: items.length });
    setError("");
  };

  const handleEdit = (item: AnnouncementItem) => {
    setEditing({ ...item });
    setError("");
  };

  const handleCancel = () => {
    setEditing(null);
    setError("");
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew
        ? "/api/announcements"
        : `/api/announcements/${editing.id}`;
      const r = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title.trim(),
          link: editing.link?.trim() || null,
          active: editing.active ?? true,
          sortOrder: editing.sortOrder ?? 0,
        }),
      });
      const d = await r.json();
      if (d.success) {
        setEditing(null);
        fetchAll();
      } else {
        setError(d.error || "Failed to save.");
      }
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this announcement? This cannot be undone.")) return;
    setDeletingId(id);
    setError("");
    try {
      const r = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      const d = await r.json();
      if (d.success) fetchAll();
      else setError(d.error || "Failed to delete.");
    } catch {
      setError("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (item: AnnouncementItem) => {
    setTogglingId(item.id);
    setError("");
    try {
      const r = await fetch(`/api/announcements/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          link: item.link || null,
          active: !item.active,
          sortOrder: item.sortOrder,
        }),
      });
      const d = await r.json();
      if (d.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, active: !item.active } : i,
          ),
        );
      } else {
        setError(d.error || "Failed to update.");
      }
    } catch {
      setError("Failed to update.");
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-7 w-40 bg-[#1077a6]/8 rounded-lg animate-pulse" />
          <div className="h-8 w-36 bg-[#1077a6]/8 rounded-lg animate-pulse" />
        </div>
        <div className="h-9 w-full bg-[#1077a6]/8 rounded-lg animate-pulse" />
        <div className="bg-white rounded-xl border border-[#1077a6]/10 overflow-hidden">
          <div className="h-10 bg-[#1077a6]/8 animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 border-t border-[#1077a6]/6"
            >
              <div className="h-4 w-4 bg-[#1077a6]/8 rounded animate-pulse" />
              <div className="h-4 flex-1 bg-[#1077a6]/8 rounded animate-pulse" />
              <div className="h-4 w-32 bg-[#1077a6]/8 rounded animate-pulse hidden sm:block" />
              <div className="h-5 w-14 bg-[#1077a6]/8 rounded-full animate-pulse" />
              <div className="h-7 w-16 bg-[#1077a6]/8 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activeItems = items.filter((i) => i.active);
  const previewDuration = Math.max(15, activeItems.length * 12);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 bg-red-50 text-red-600 rounded-lg p-2.5 text-xs border border-red-100"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1077a6]/10 flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-[#1077a6]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1a1550] leading-none">
              Announcements
            </h2>
            <p className="text-[10px] text-[#1a1550]/35 mt-0.5">
              {activeItems.length} active · {items.length} total
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleNew}
          disabled={!!editing}
          className="h-8 text-xs gap-1.5 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-lg disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Announcement
        </Button>
      </div>

      {activeItems.length > 0 && (
        <div className="rounded-lg overflow-hidden border border-[#1077a6]/20">
          <div className="bg-[#1077a6]/8 px-3 py-1.5 border-b border-[#1077a6]/10">
            <p className="text-[10px] font-semibold text-[#1077a6]/60 uppercase tracking-widest">
              Live Preview
            </p>
          </div>

          <div
            className="w-full flex items-center overflow-hidden"
            style={{ height: 36, background: "#0a5f85" }}
          >
            <div
              className="shrink-0 flex items-center gap-1.5 px-3 self-stretch"
              style={{ background: "#f4c430" }}
            >
              <Megaphone className="w-3.5 h-3.5 text-[#1a1550] shrink-0" />
              <span className="text-[#1a1550] text-[10px] font-black uppercase tracking-widest whitespace-nowrap hidden sm:block select-none">
                Notice
              </span>
            </div>
            <div className="w-px h-full bg-white/20 shrink-0" />

            <div className="relative flex-1 overflow-hidden h-full flex items-center">
              <style>{`
                @keyframes admin-preview-scroll {
                  0%   { transform: translateX(100%); }
                  100% { transform: translateX(-100%); }
                }
                .admin-preview-track {
                  animation: admin-preview-scroll ${previewDuration}s linear infinite;
                  will-change: transform;
                  display: inline-flex;
                  align-items: center;
                  white-space: nowrap;
                }
              `}</style>
              <div className="admin-preview-track">
                {activeItems.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center shrink-0"
                  >
                    <span
                      className="text-white/40 text-[9px] mx-4 select-none"
                      aria-hidden
                    >
                      ◆
                    </span>
                    <span className="text-white text-[12px] font-medium">
                      {item.title}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-[#1077a6]/25 shadow-sm">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#1a1550]">
                    {editing.id ? "Edit Announcement" : "New Announcement"}
                  </p>
                  <button
                    onClick={handleCancel}
                    className="p-1 rounded-md text-[#1a1550]/30 hover:text-[#1a1550]/60 hover:bg-[#1077a6]/5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>
                      Title <span className="text-red-400">*</span>
                    </label>
                    <Input
                      value={editing.title || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, title: e.target.value })
                      }
                      placeholder="e.g. Applications open for Tribal Fellowship 2025"
                      className={inputCls}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                        if (e.key === "Escape") handleCancel();
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls}>
                      Link{" "}
                      <span className="text-[#1a1550]/25 text-[10px]">
                        optional — opens in new tab when clicked
                      </span>
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1a1550]/25 pointer-events-none" />
                      <Input
                        value={editing.link || ""}
                        onChange={(e) =>
                          setEditing({ ...editing, link: e.target.value })
                        }
                        placeholder="https://example.com"
                        className={`${inputCls} pl-8`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave();
                          if (e.key === "Escape") handleCancel();
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Sort Order</label>
                    <Input
                      type="number"
                      min={0}
                      value={editing.sortOrder ?? 0}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          sortOrder: parseInt(e.target.value) || 0,
                        })
                      }
                      className={inputCls}
                    />
                  </div>

                  <div className="flex items-center gap-2.5 pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({ ...editing, active: !editing.active })
                      }
                      className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                        editing.active ? "bg-[#1077a6]" : "bg-[#1a1550]/15"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                          editing.active ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-xs text-[#1a1550]/60 font-medium">
                      {editing.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-[#1077a6]/8">
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
                    )}
                    {saving ? "Saving…" : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                    className="h-8 text-xs gap-1.5 rounded-lg border-[#1077a6]/20 text-[#1a1550]/50"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </Button>
                  <span className="text-[10px] text-[#1a1550]/25 ml-auto hidden sm:block">
                    Press Enter to save · Esc to cancel
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl border border-[#1077a6]/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#1077a6] text-white">
                <th className="px-3 py-3 text-left font-semibold w-8 opacity-60">
                  #
                </th>
                <th className="px-3 py-3 text-left font-semibold">
                  Announcement
                </th>
                <th className="px-3 py-3 text-left font-semibold hidden sm:table-cell">
                  Link
                </th>
                <th className="px-3 py-3 text-left font-semibold hidden md:table-cell w-24">
                  Order
                </th>
                <th className="px-3 py-3 text-left font-semibold w-24">
                  Status
                </th>
                <th className="px-3 py-3 text-right font-semibold w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    className={`border-t border-[#1077a6]/[0.06] transition-colors ${
                      !item.active ? "opacity-50" : ""
                    } hover:bg-[#1077a6]/[0.02]`}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <GripVertical className="w-3 h-3 text-[#1a1550]/15" />
                        <span className="text-[#1a1550]/30 font-mono">
                          {i + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-[#1a1550] text-[12.5px] leading-snug line-clamp-2 max-w-xs">
                        {item.title}
                      </p>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sm:hidden text-[10px] text-[#1077a6] hover:underline truncate max-w-[200px] inline-block mt-0.5"
                        >
                          {item.link}
                        </a>
                      )}
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1077a6] hover:underline underline-offset-2 truncate max-w-[180px] inline-block text-[11px]"
                          title={item.link}
                        >
                          {item.link}
                        </a>
                      ) : (
                        <span className="text-[#1a1550]/20 italic">
                          No link
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell text-[#1a1550]/40">
                      {item.sortOrder}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.active
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-gray-100 text-gray-400 border border-gray-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            item.active ? "bg-emerald-500" : "bg-gray-300"
                          }`}
                        />
                        {item.active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleActive(item)}
                          disabled={togglingId === item.id}
                          title={item.active ? "Hide" : "Show"}
                          className="p-1.5 rounded-md hover:bg-[#1077a6]/8 text-[#1077a6]/50 hover:text-[#1077a6] transition-colors disabled:opacity-40"
                        >
                          {togglingId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : item.active ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          disabled={!!editing}
                          title="Edit"
                          className="p-1.5 rounded-md hover:bg-[#1077a6]/8 text-[#1077a6] transition-colors disabled:opacity-40"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          title="Delete"
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {items.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#1077a6]/8 flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-[#1077a6]/40" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#1a1550]/40">
                          No announcements yet
                        </p>
                        <p className="text-[11px] text-[#1a1550]/25 mt-0.5">
                          Click &quot;Add Announcement&quot; to create your
                          first one
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleNew}
                        className="h-8 text-xs gap-1.5 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-lg mt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Announcement
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {items.length > 0 && (
          <div className="px-4 py-2.5 border-t border-[#1077a6]/6 bg-[#f8f9fb] flex items-center justify-between">
            <p className="text-[11px] text-[#1a1550]/35">
              {activeItems.length} active · {items.length - activeItems.length}{" "}
              hidden · {items.length} total
            </p>
            <p className="text-[10px] text-[#1a1550]/25 hidden sm:block">
              Hover on marquee banner to pause scrolling
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
