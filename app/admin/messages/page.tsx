"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertCircle, Eye, Mail, Loader2 } from "lucide-react";

interface Message {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const r = await fetch("/api/contact");
      const d = await r.json();
      if (d.success) setMessages(d.data);
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

  const markRead = async (m: Message) => {
    try {
      await fetch(`/api/contact/${m.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      fetch_();
    } catch {}
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    try {
      const r = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      const d = await r.json();
      if (d.success) {
        setSelected(null);
        fetch_();
      } else setError(d.error);
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
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-lg p-2.5 text-xs border border-red-100">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-1 bg-white rounded-lg border border-[#1077a6]/[0.12] overflow-hidden">
          <div className="bg-[#1077a6] text-white px-3 py-2 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#f4c430]" />
            <span className="text-xs font-semibold">
              Inbox ({messages.length})
            </span>
          </div>
          <div className="divide-y divide-[#1077a6]/[0.06] max-h-[450px] overflow-y-auto">
            {messages.map((m, i) => (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  setSelected(m);
                  if (!m.read) markRead(m);
                }}
                className={`w-full text-left px-3 py-2.5 hover:bg-[#1077a6]/[0.03] transition-colors ${
                  selected?.id === m.id ? "bg-[#1077a6]/[0.05]" : ""
                } ${!m.read ? "border-l-2 border-[#f4c430]" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs truncate ${!m.read ? "font-bold text-[#1a1550]" : "text-[#1a1550]/50"}`}
                  >
                    {m.firstName} {m.lastName || ""}
                  </span>
                  {!m.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f4c430] shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-[#1a1550]/30 truncate mt-0.5">
                  {m.message}
                </p>
                <p className="text-[9px] text-[#1a1550]/20 mt-0.5">
                  {new Date(m.createdAt).toLocaleDateString()}
                </p>
              </motion.button>
            ))}
            {messages.length === 0 && (
              <div className="px-3 py-10 text-center text-[10px] text-[#1a1550]/20">
                No messages.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg border border-[#1077a6]/[0.12] p-4">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#1a1550]">
                      {selected.firstName} {selected.lastName || ""}
                    </p>
                    <p className="text-[10px] text-[#1a1550]/30 mt-0.5">
                      {selected.email} ·{" "}
                      {new Date(selected.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="p-1.5 rounded-md hover:bg-red-50 text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="bg-[#1077a6]/[0.03] rounded-lg p-3 text-xs text-[#1a1550]/60 leading-relaxed whitespace-pre-wrap border border-[#1077a6]/[0.08]">
                  {selected.message}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-[#1a1550]/20"
              >
                <Eye className="w-5 h-5 mb-1.5" />
                <p className="text-xs">Select a message</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
