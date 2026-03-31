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
  Users,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface StaffItem {
  id: number;
  name: string;
  designation: string;
  cadre?: string;
  email?: string;
  phone?: string;
  type: "officer" | "staff";
  sortOrder: number;
  active: boolean;
}

const inputCls =
  "h-9 text-xs border-[#1077a6]/[0.15] rounded-lg focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20";
const labelCls = "text-[11px] font-medium text-[#1a1550]/40 mb-1 block";

type TabType = "officer" | "staff";

export default function StaffAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>("officer");
  const [officers, setOfficers] = useState<StaffItem[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffItem[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Partial<StaffItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch both lists
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [oRes, sRes] = await Promise.all([
        fetch("/api/officers"),
        fetch("/api/staff"),
      ]);
      const [oData, sData] = await Promise.all([oRes.json(), sRes.json()]);
      if (oData.success) setOfficers(oData.data);
      if (sData.success) setStaffMembers(sData.data);
    } catch {
      setError("Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const items = activeTab === "officer" ? officers : staffMembers;
  const apiBase = activeTab === "officer" ? "/api/officers" : "/api/staff";

  const handleNew = () => {
    setEditing({
      name: "",
      designation: "",
      cadre: "",
      email: "",
      phone: "",
      type: activeTab,
      sortOrder: 0,
      active: true,
    });
  };

  const handleEdit = (item: StaffItem) => {
    setEditing({ ...item });
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name?.trim()) {
      setError("Name is required.");
      return;
    }
    if (!editing.designation?.trim()) {
      setError("Designation is required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? apiBase : `${apiBase}/${editing.id}`;
      const r = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const d = await r.json();
      if (d.success) {
        setEditing(null);
        fetchAll();
      } else {
        setError(d.error);
      }
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this entry?")) return;
    setError("");
    try {
      const r = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      const d = await r.json();
      if (d.success) fetchAll();
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
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center bg-[#f0f4f8] rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => {
              setActiveTab("officer");
              setEditing(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              activeTab === "officer"
                ? "bg-[#1077a6] text-white shadow-sm"
                : "text-[#1a1550]/50 hover:text-[#1a1550]"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Officers
            <span
              className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "officer"
                  ? "bg-white/20 text-white"
                  : "bg-[#1077a6]/10 text-[#1077a6]"
              }`}
            >
              {officers.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("staff");
              setEditing(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              activeTab === "staff"
                ? "bg-[#1077a6] text-white shadow-sm"
                : "text-[#1a1550]/50 hover:text-[#1a1550]"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Staff
            <span
              className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "staff"
                  ? "bg-white/20 text-white"
                  : "bg-[#1077a6]/10 text-[#1077a6]"
              }`}
            >
              {staffMembers.length}
            </span>
          </button>
        </div>

        <Button
          size="sm"
          onClick={handleNew}
          className="h-8 text-xs gap-1.5 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-lg"
        >
          <Plus className="w-3.5 h-3.5" />
          Add {activeTab === "officer" ? "Officer" : "Staff"}
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
                  {editing.id ? "Edit" : "New"}{" "}
                  {activeTab === "officer" ? "Officer" : "Staff Member"}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>
                      Name <span className="text-red-400">*</span>
                    </label>
                    <Input
                      value={editing.name || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                      placeholder="Full name"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      Designation <span className="text-red-400">*</span>
                    </label>
                    <Input
                      value={editing.designation || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, designation: e.target.value })
                      }
                      placeholder="e.g. Research Officer"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      Cadre{" "}
                      <span className="text-[#1a1550]/25 text-[10px]">
                        (optional)
                      </span>
                    </label>
                    <Input
                      value={editing.cadre || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, cadre: e.target.value })
                      }
                      placeholder="e.g. State Civil Service"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Email</label>
                    <Input
                      type="email"
                      value={editing.email || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, email: e.target.value })
                      }
                      placeholder="email@example.com"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Phone</label>
                    <Input
                      value={editing.phone || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, phone: e.target.value })
                      }
                      placeholder="+91 XXXXXXXXXX"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Sort Order</label>
                    <Input
                      type="number"
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

                <div className="flex gap-2 pt-1">
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
                    onClick={() => {
                      setEditing(null);
                      setError("");
                    }}
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
                Designation
              </th>
              <th className="px-3 py-2.5 text-left font-semibold hidden md:table-cell">
                Cadre
              </th>
              <th className="px-3 py-2.5 text-left font-semibold hidden lg:table-cell">
                Email
              </th>
              <th className="px-3 py-2.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-[#1077a6]/[0.06] hover:bg-[#1077a6]/[0.02]"
                >
                  <td className="px-3 py-2.5 text-[#1a1550]/30">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <p className="font-semibold text-[#1a1550]">{item.name}</p>

                    <p className="text-[10px] text-[#1a1550]/40 sm:hidden">
                      {item.designation}
                      {item.cadre && ` · ${item.cadre}`}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 text-[#1a1550]/60 hidden sm:table-cell">
                    {item.designation}
                  </td>
                  <td className="px-3 py-2.5 text-[#1a1550]/40 hidden md:table-cell">
                    {item.cadre || (
                      <span className="text-[#1a1550]/20 italic">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-[#1a1550]/40 hidden lg:table-cell">
                    {item.email || (
                      <span className="text-[#1a1550]/20 italic">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded-md hover:bg-[#1077a6]/10 text-[#1077a6] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-10 text-center text-[#1a1550]/25"
                >
                  No {activeTab === "officer" ? "officers" : "staff"} yet. Click
                  &quot;Add&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
