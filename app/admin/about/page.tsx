"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, Save, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const RichEditor = dynamic(() => import("@/components/admin/RichEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-[#1077a6]/[0.12] rounded-lg p-4 text-sm text-[#1a1550]/40">
      Loading editor...
    </div>
  ),
});

export default function AboutAdmin() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/pages/about")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.content) {
          const c = res.data.content as Record<string, unknown>;
          if (typeof c.content === "string") setContent(c.content);
        }
      })
      .catch(() => setError("Failed to load about page data."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await fetch("/api/pages/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "About",
          content: { content },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else setError(data.error);
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
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-lg p-3 text-xs border border-red-100">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 rounded-lg p-3 text-xs border border-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5" /> {success}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#1077a6]/[0.12] p-5">
        <p className="font-bold text-[#1a1550] text-sm mb-1">
          About Us Content
        </p>
        <p className="text-[#1a1550]/40 text-xs mb-4">
          This content is displayed on the About Us page below the hero banner.
        </p>
        <RichEditor
          content={content}
          onChange={setContent}
          placeholder="Write the about us content here…"
        />
      </div>

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
          Save About Page
        </Button>
      </div>
    </div>
  );
}
