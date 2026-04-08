// components/admin/ArchivesAdmin.tsx
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
  FileText,
  Loader2,
  Calendar,
  FolderArchive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ImageUpload from "@/components/admin/ImageUpload";

interface Archive {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  pdfUrl: string;
  publishedAt: string;
  active: boolean;
}

const inputCls =
  "h-9 text-xs border-[#1077a6]/[0.15] rounded-lg focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20";
const labelCls = "text-[11px] font-medium text-[#1a1550]/40 mb-1 block";

export default function ArchivesAdmin() {
  const [items, setItems] = useState<Archive[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Partial<Archive> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const r = await fetch("/api/archives?includeInactive=true");
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
    fetchItems();
  }, [fetchItems]);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.pdfUrl) {
      setError("A PDF file is required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const isNew = !editing.id;
      const r = await fetch(
        isNew ? "/api/archives" : `/api/archives/${editing.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
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
    if (!confirm("Delete this archive entry?")) return;
    try {
      const r = await fetch(`/api/archives/${id}`, { method: "DELETE" });
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
          <FolderArchive className="w-3.5 h-3.5 text-[#1077a6]" />
          <span className="text-xs font-semibold text-[#1a1550]">
            Archive Documents
          </span>
        </div>
        <Button
          size="sm"
          onClick={() =>
            setEditing({
              title: "",
              description: "",
              category: "",
              pdfUrl: "",
              active: true,
            })
          }
          className="h-8 text-xs gap-1.5 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-lg"
        >
          <Plus className="w-3.5 h-3.5" /> Add Archive
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
                  {editing.id ? "Edit" : "New"} Archive Entry
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Title</label>
                    <Input
                      value={editing.title || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, title: e.target.value })
                      }
                      placeholder="Document title"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Category (optional)</label>
                    <Input
                      value={editing.category || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, category: e.target.value })
                      }
                      placeholder="e.g., 2023, Annual Report, etc."
                      className={inputCls}
                    />
                    <p className="text-[9px] text-[#1a1550]/30 mt-1">
                      Year or document type for filtering
                    </p>
                  </div>

                  <div>
                    <label className={labelCls}>Date</label>
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

                <div>
                  <label className={labelCls}>Description (optional)</label>
                  <textarea
                    value={editing.description || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                    rows={3}
                    placeholder="Brief description of this document"
                    className={`w-full resize-none ${inputCls} py-2 px-3 h-auto`}
                  />
                </div>

                <ImageUpload
                  value={editing.pdfUrl || ""}
                  onChange={(url) => setEditing({ ...editing, pdfUrl: url })}
                  label="PDF File (max 16MB)"
                  endpoint="archivePdfUploader"
                  fileType="pdf"
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

      <div className="bg-white rounded-lg border border-[#1077a6]/12 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1077a6]/8 bg-[#f8f7fc]">
                <th className="text-left px-4 py-2.5 font-semibold text-[#1a1550]/50">
                  Title
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#1a1550]/50 hidden lg:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#1a1550]/50 hidden sm:table-cell">
                  Date
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#1a1550]/50 hidden md:table-cell">
                  Status
                </th>
                <th className="text-right px-4 py-2.5 font-semibold text-[#1a1550]/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-[#1a1550]/30"
                  >
                    No archive entries yet.
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#1077a6]/6 last:border-0 hover:bg-[#f8f7fc]/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="font-medium text-[#1a1550] line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-[#1a1550]/40 mt-0.5 ml-5.5 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#1a1550]/50 hidden lg:table-cell">
                    {item.category ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1077a6]/10 text-[#1077a6]">
                        {item.category}
                      </span>
                    ) : (
                      <span className="text-[#1a1550]/20 text-[10px]">
                        Uncategorized
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#1a1550]/50 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.publishedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditing(item)}
                        className="w-7 h-7 rounded flex items-center justify-center text-[#1077a6]/60 hover:text-[#1077a6] hover:bg-[#1077a6]/8 transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-7 h-7 rounded flex items-center justify-center text-red-400/60 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
