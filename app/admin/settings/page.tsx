"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Save,
  Link2,
  Mail,
  Phone,
  MapPin,
  Users,
  Clock,
  RotateCcw,
  Globe,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FooterLink {
  label: string;
  href: string;
}
interface State {
  siteTitle: string;
  email: string;
  phone: string;
  address: string;
  footerLinks: FooterLink[];
}
interface Live {
  visitors: string;
  lastUpdated: string;
}

const inputCls =
  "h-8 text-xs border-[#1077a6]/[0.15] rounded-md focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20 bg-white";
const labelCls =
  "text-[10px] font-semibold text-[#1a1550]/40 uppercase tracking-wide mb-1 block";

function SectionHeader({
  icon,
  label,
  accent = "#1077a6",
  children,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between pb-2 border-b border-[#1077a6]/[0.08] mb-3">
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          {icon}
        </div>
        <span className="text-xs font-bold text-[#1a1550]">{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function SettingsAdmin() {
  const [s, setS] = useState<State>({
    siteTitle: "",
    email: "",
    phone: "",
    address: "",
    footerLinks: [],
  });
  const [live, setLive] = useState<Live>({ visitors: "—", lastUpdated: "—" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const flash = (m: string) => {
    setSuccess(m);
    setTimeout(() => setSuccess(""), 3000);
  };

  const fetch_ = useCallback(async () => {
    try {
      const [sr, lr] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/settings/last-updated"),
      ]);
      const sd = await sr.json();
      const ld = await lr.json();
      if (sd.success) {
        const d = sd.data as Record<string, string>;
        let links: FooterLink[] = [];
        try {
          const p = JSON.parse(d.footer_links || "[]");
          if (Array.isArray(p)) links = p;
        } catch {}
        setS({
          siteTitle: d.site_title ?? "",
          email: d.footer_email ?? "",
          phone: d.footer_phone ?? "",
          address: d.footer_address ?? "",
          footerLinks: links,
        });
        setLive((p) => ({
          ...p,
          visitors: d.visitors_count
            ? Number(d.visitors_count).toLocaleString("en-IN")
            : "0",
        }));
      }
      if (ld.success) setLive((p) => ({ ...p, lastUpdated: ld.date }));
    } catch {
      setError("Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  const save = async (section: string, payload: Record<string, string>) => {
    setSaving(section);
    setError("");
    try {
      const r = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (d.success) {
        flash("Saved!");
        fetch_();
      } else setError(d.error || "Failed.");
    } catch {
      setError("Failed.");
    } finally {
      setSaving(null);
    }
  };

  const resetVisitors = async () => {
    if (!confirm("Reset visitor count to 0?")) return;
    setSaving("vis");
    try {
      await fetch("/api/settings/visitors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 0 }),
      });
      setLive((p) => ({ ...p, visitors: "0" }));
      flash("Reset!");
    } catch {
      setError("Failed.");
    } finally {
      setSaving(null);
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
      className="w-full space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 bg-red-50 text-red-600 rounded-lg p-2.5 text-xs border border-red-100"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-600 rounded-lg p-2.5 text-xs border border-emerald-100"
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg border border-[#1077a6]/[0.12] p-3">
          <SectionHeader
            icon={<Users className="w-3.5 h-3.5" />}
            label="Live Stats"
            accent="#f4c430"
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2.5 rounded-md bg-[#1077a6]/[0.03] border border-[#1077a6]/[0.08]">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-[#1a1550]/30 font-semibold">
                  Visitors
                </p>
                <p className="text-2xl font-bold text-[#1a1550] leading-tight">
                  {live.visitors}
                </p>
              </div>
              <button
                onClick={resetVisitors}
                disabled={saving === "vis"}
                title="Reset to 0"
                className="p-1.5 rounded-md hover:bg-red-50 text-red-400 disabled:opacity-40 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-col justify-center gap-0.5 p-2.5 rounded-md bg-[#1077a6]/[0.03] border border-[#1077a6]/[0.08]">
              <div className="flex items-center gap-1 mb-0.5">
                <Clock className="w-3 h-3 text-[#1077a6]" />
                <p className="text-[9px] uppercase tracking-wider text-[#1a1550]/30 font-semibold">
                  Last Updated
                </p>
              </div>
              <p className="text-xs font-bold text-[#1a1550]">
                {live.lastUpdated}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#1077a6]/[0.12] p-3">
          <SectionHeader
            icon={<Globe className="w-3.5 h-3.5" />}
            label="Site Info"
          />
          <div className="flex gap-2 items-end">
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Site Title</label>
              <Input
                value={s.siteTitle}
                onChange={(e) => setS({ ...s, siteTitle: e.target.value })}
                placeholder="e.g. My Organisation"
                className={inputCls}
              />
            </div>
            <Button
              size="sm"
              onClick={() => save("site", { site_title: s.siteTitle })}
              disabled={saving === "site"}
              className="h-8 text-xs gap-1 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-md shrink-0"
            >
              {saving === "site" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Save className="w-3 h-3" />
              )}
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#1077a6]/[0.12] p-3">
        <SectionHeader
          icon={<Mail className="w-3.5 h-3.5" />}
          label="Contact Info"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <div>
            <label className={labelCls}>
              <Mail className="w-2.5 h-2.5 inline mr-1 opacity-60" />
              Email
            </label>
            <Input
              type="email"
              value={s.email}
              onChange={(e) => setS({ ...s, email: e.target.value })}
              placeholder="contact@example.com"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>
              <Phone className="w-2.5 h-2.5 inline mr-1 opacity-60" />
              Phone
            </label>
            <Input
              value={s.phone}
              onChange={(e) => setS({ ...s, phone: e.target.value })}
              placeholder="+91 00000 00000"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={labelCls}>
              <MapPin className="w-2.5 h-2.5 inline mr-1 opacity-60" />
              Address
            </label>
            <textarea
              value={s.address}
              onChange={(e) => setS({ ...s, address: e.target.value })}
              rows={2}
              placeholder="Full address..."
              className="w-full resize-none text-xs border border-[#1077a6]/[0.15] rounded-md focus:border-[#1077a6] focus:ring-1 focus:ring-[#1077a6]/10 text-[#1a1550] placeholder:text-[#1a1550]/20 bg-white py-1.5 px-3 outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end mt-2.5">
          <Button
            size="sm"
            onClick={() =>
              save("contact", {
                footer_email: s.email,
                footer_phone: s.phone,
                footer_address: s.address,
              })
            }
            disabled={saving === "contact"}
            className="h-8 text-xs gap-1 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-md"
          >
            {saving === "contact" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            Save Contact
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#1077a6]/[0.12] p-3">
        <SectionHeader
          icon={<Link2 className="w-3.5 h-3.5" />}
          label={`Footer Links (${s.footerLinks.length})`}
        >
          <button
            onClick={() =>
              setS({
                ...s,
                footerLinks: [...s.footerLinks, { label: "", href: "" }],
              })
            }
            className="flex items-center gap-1 text-[10px] font-semibold text-[#1077a6] hover:text-[#f4c430] transition-colors px-2 py-1 rounded-md hover:bg-[#1077a6]/[0.05]"
          >
            <Plus className="w-3 h-3" /> Add Link
          </button>
        </SectionHeader>

        {s.footerLinks.length === 0 ? (
          <p className="text-[10px] text-[#1a1550]/20 italic py-1">
            No footer links yet. Click "Add Link" to create one.
          </p>
        ) : (
          <div className="space-y-1.5">
            <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_32px] gap-2 px-1 mb-0.5">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[#1a1550]/25">
                Label
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[#1a1550]/25">
                URL
              </span>
            </div>

            {s.footerLinks.map((lk, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_32px] gap-1.5 p-2 rounded-md bg-[#1077a6]/[0.02] border border-[#1077a6]/[0.07]"
              >
                <div>
                  <label className="text-[9px] text-[#1a1550]/30 uppercase tracking-wider font-medium block mb-0.5 sm:hidden">
                    Label
                  </label>
                  <Input
                    value={lk.label}
                    onChange={(e) => {
                      const n = [...s.footerLinks];
                      n[idx] = { ...n[idx], label: e.target.value };
                      setS({ ...s, footerLinks: n });
                    }}
                    placeholder="Home"
                    className={`${inputCls} h-7`}
                  />
                </div>
                <div>
                  <label className="text-[9px] text-[#1a1550]/30 uppercase tracking-wider font-medium block mb-0.5 sm:hidden">
                    URL
                  </label>
                  <Input
                    type="url"
                    value={lk.href}
                    onChange={(e) => {
                      const n = [...s.footerLinks];
                      n[idx] = { ...n[idx], href: e.target.value };
                      setS({ ...s, footerLinks: n });
                    }}
                    placeholder="https://..."
                    className={`${inputCls} h-7`}
                  />
                </div>
                <button
                  onClick={() =>
                    setS({
                      ...s,
                      footerLinks: s.footerLinks.filter((_, i) => i !== idx),
                    })
                  }
                  className="self-center justify-self-end sm:justify-self-auto p-1 rounded-md hover:bg-red-50 text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-3">
          <Button
            size="sm"
            onClick={() =>
              save("links", {
                footer_links: JSON.stringify(s.footerLinks),
              })
            }
            disabled={saving === "links"}
            className="h-8 text-xs gap-1 bg-[#1077a6] hover:bg-[#1077a6]/90 rounded-md"
          >
            {saving === "links" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            Save Links
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
