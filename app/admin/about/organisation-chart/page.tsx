"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Save, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const inputCls =
  "h-9 text-xs border-[#1077a6]/[0.15] rounded-lg focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20";
const labelCls = "text-[11px] font-medium text-[#1a1550]/40 mb-1 block";

export default function OrgChartAdmin() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/pages/about-organisation-chart")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.content) {
          const c = res.data.content as Record<string, unknown>;
          if (typeof c.bannerTitle === "string") setTitle(c.bannerTitle);
          if (typeof c.bannerSubtitle === "string")
            setSubtitle(c.bannerSubtitle);
        }
      })
      .catch(() => setError("Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const r = await fetch("/api/pages/about-organisation-chart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Organisation Chart",
          content: { bannerTitle: title, bannerSubtitle: subtitle },
        }),
      });
      const d = await r.json();
      if (d.success) {
        setSuccess("Saved!");
        setTimeout(() => setSuccess(""), 3000);
      } else setError(d.error);
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
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
      className="space-y-3 max-w-2xl"
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
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-600 rounded-lg p-2.5 text-xs border border-emerald-100"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> {success}
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="border-[#1077a6]/[0.12]">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-bold text-[#1a1550]">Banner</p>
          <div>
            <label className={labelCls}>Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Organisation Chart"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Subtitle</label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className={inputCls}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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
      </div>
    </motion.div>
  );
}
