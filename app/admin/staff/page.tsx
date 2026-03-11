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

interface StaffItem {
  id: number;
  name: string;
  position: string;
  sortOrder: number;
  active: boolean;
}

const inputCls =
  "h-9 text-xs border-[#1077a6]/[0.15] rounded-lg focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20";
const labelCls = "text-[11px] font-medium text-[#1a1550]/40 mb-1 block";

export default function StaffAdmin() {
  const [items, setItems] = useState<StaffItem[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Partial<StaffItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch_ = useCallback(async () => {
    try {
      const r = await fetch("/api/staff");
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
      const isNew = !editing.id;
      const r = await fetch(isNew ? "/api/staff" : `/api/staff/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
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

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    try {
      const r = await fetch(`/api/staff/${id}`, { method: "DELETE" });
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
            setEditing({ name: "", position: "", sortOrder: 0, active: true })
          }
          className="h-8 text-xs gap-1.5 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-lg"
        >
          <Plus className="w-3.5 h-3.5" /> Add Staff
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
                  {editing.id ? "Edit" : "New"} Staff Member
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    <label className={labelCls}>Position</label>
                    <Input
                      value={editing.position || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, position: e.target.value })
                      }
                      className={inputCls}
                    />
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
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      checked={editing.active ?? true}
                      onChange={(e) =>
                        setEditing({ ...editing, active: e.target.checked })
                      }
                      className="w-3.5 h-3.5 accent-[#1077a6]"
                    />
                    <span className="text-xs text-[#1a1550]">Active</span>
                  </div>
                </div>
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
              <th className="px-3 py-2.5 text-left font-semibold w-8">#</th>
              <th className="px-3 py-2.5 text-left font-semibold">Name</th>
              <th className="px-3 py-2.5 text-left font-semibold hidden sm:table-cell">
                Position
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
                <td className="px-3 py-2.5 text-[#1a1550]/30">{i + 1}</td>
                <td className="px-3 py-2.5">
                  <p className="font-semibold text-[#1a1550]">{item.name}</p>
                  <p className="text-[10px] text-[#1a1550]/40 sm:hidden">
                    {item.position}
                  </p>
                </td>
                <td className="px-3 py-2.5 text-[#1a1550]/40 hidden sm:table-cell">
                  {item.position}
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
                  colSpan={4}
                  className="px-3 py-10 text-center text-[#1a1550]/25"
                >
                  No staff yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
