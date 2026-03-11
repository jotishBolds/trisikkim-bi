"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Accessibility,
  X,
  RefreshCw,
  Minus,
  Plus,
  AlignJustify,
  CaseSensitive,
  Contrast,
  Palette,
  Link2,
  Focus,
  Zap,
  ScanLine,
} from "lucide-react";

// ─── State shape ──────────────────────────────────────────────────
type LineSpacing = "default" | "relaxed" | "loose";
type LetterSpacing = "default" | "wide" | "wider";

interface A11yState {
  fontStep: number; // 0–4  (each step = +12.5% font size)
  lineSpacing: LineSpacing;
  letterSpacing: LetterSpacing;
  highContrast: boolean;
  grayscale: boolean;
  invertColors: boolean;
  highlightLinks: boolean;
  enhancedFocus: boolean;
  reduceMotion: boolean;
}

const DEFAULT: A11yState = {
  fontStep: 0,
  lineSpacing: "default",
  letterSpacing: "default",
  highContrast: false,
  grayscale: false,
  invertColors: false,
  highlightLinks: false,
  enhancedFocus: false,
  reduceMotion: false,
};

const STORAGE_KEY = "a11y-prefs";
const FONT_STEP_CLASSES = [
  "",
  "a11y-text-1",
  "a11y-text-2",
  "a11y-text-3",
  "a11y-text-4",
];
const FONT_PCT = ["100%", "113%", "125%", "138%", "150%"];

function applyClasses(s: A11yState) {
  const h = document.documentElement;

  // Font size
  for (const c of FONT_STEP_CLASSES) if (c) h.classList.remove(c);
  if (s.fontStep > 0) h.classList.add(FONT_STEP_CLASSES[s.fontStep]);

  // Line spacing
  h.classList.remove("a11y-line-relaxed", "a11y-line-loose");
  if (s.lineSpacing === "relaxed") h.classList.add("a11y-line-relaxed");
  if (s.lineSpacing === "loose") h.classList.add("a11y-line-loose");

  // Letter spacing
  h.classList.remove("a11y-letters-wide", "a11y-letters-wider");
  if (s.letterSpacing === "wide") h.classList.add("a11y-letters-wide");
  if (s.letterSpacing === "wider") h.classList.add("a11y-letters-wider");

  // Toggles
  h.classList.toggle("a11y-contrast", s.highContrast);
  h.classList.toggle("a11y-grayscale", s.grayscale);
  h.classList.toggle("a11y-invert", s.invertColors);
  h.classList.toggle("a11y-links", s.highlightLinks);
  h.classList.toggle("a11y-focus", s.enhancedFocus);
  h.classList.toggle("a11y-no-motion", s.reduceMotion);
}

function isDefault(s: A11yState) {
  return (
    s.fontStep === 0 &&
    s.lineSpacing === "default" &&
    s.letterSpacing === "default" &&
    !s.highContrast &&
    !s.grayscale &&
    !s.invertColors &&
    !s.highlightLinks &&
    !s.enhancedFocus &&
    !s.reduceMotion
  );
}

// ─── Main component ───────────────────────────────────────────────
export default function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yState>(DEFAULT);
  const [mounted, setMounted] = useState(false);

  // Restore saved prefs on mount
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: A11yState = { ...DEFAULT, ...JSON.parse(raw) };
        setPrefs(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Apply CSS classes to <html> whenever prefs change (proper React pattern)
  useEffect(() => {
    if (!mounted) return;
    applyClasses(prefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs, mounted]);

  // Helpers
  const update = useCallback((patch: Partial<A11yState>) => {
    setPrefs((p) => ({ ...p, ...patch }));
  }, []);

  const reset = () => {
    setPrefs(DEFAULT);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  if (!mounted) return null;

  const hasChanges = !isDefault(prefs);

  return (
    <>
      {/* ── Trigger tab ────────────────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={
          open ? "Close accessibility options" : "Open accessibility options"
        }
        aria-expanded={open}
        title="Accessibility Tools"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999] w-10 h-auto min-h-[44px] py-2.5 flex flex-col items-center justify-center gap-1 bg-[#1077A6] text-white shadow-lg hover:bg-[#0e6590] active:bg-[#0c5a80] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4c430]"
        style={{
          borderRadius: "8px 0 0 8px",
          boxShadow: "-2px 2px 14px rgba(16,119,166,0.4)",
        }}
      >
        {open ? (
          <X className="w-4 h-4" />
        ) : (
          <Accessibility className="w-4 h-4" />
        )}
        {hasChanges && !open && (
          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#f4c430] rounded-full border-2 border-white" />
        )}
      </button>

      {/* ── Backdrop (mobile) ─────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-[9997] bg-black/20 sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Panel ─────────────────────────────────────── */}
      {open && (
        <div
          role="dialog"
          aria-label="Accessibility toolbar"
          className={[
            // Mobile: bottom sheet
            "fixed bottom-0 left-0 right-0 z-[9998]",
            "sm:bottom-auto sm:left-auto sm:right-10",
            "sm:top-1/2 sm:-translate-y-1/2",
            // Sizing
            "w-full sm:w-[300px]",
            "max-h-[78vh] sm:max-h-[92vh]",
            // Style
            "bg-white border border-[#1077A6]/15",
            "rounded-t-2xl sm:rounded-2xl",
            "overflow-y-auto",
            "shadow-2xl",
          ].join(" ")}
          style={{
            boxShadow:
              "0 -4px 40px rgba(16,119,166,0.15), 0 8px 32px rgba(16,119,166,0.12)",
          }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white flex items-center justify-between gap-3 px-5 py-4 border-b border-[#1077A6]/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1077A6]/10 flex items-center justify-center">
                <Accessibility className="w-4 h-4 text-[#1077A6]" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#1a1550] leading-none">
                  Accessibility
                </p>
                <p className="text-[10px] text-[#1a1550]/40 mt-0.5">
                  Adjust display preferences
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="p-1.5 rounded-lg hover:bg-[#f8f7fc] text-[#1a1550]/40 hover:text-[#1a1550] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-5">
            {/* ── 1. Font Size ── */}
            <Section
              icon={<CaseSensitive className="w-4 h-4" />}
              title="Text Size"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    update({ fontStep: Math.max(0, prefs.fontStep - 1) })
                  }
                  disabled={prefs.fontStep === 0}
                  aria-label="Decrease text size"
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-[#f8f7fc] text-[#1a1550]/60 hover:bg-[#1077A6]/10 hover:text-[#1077A6] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-lg font-bold text-[#1a1550]">
                    {FONT_PCT[prefs.fontStep]}
                  </p>
                  <div className="flex justify-center gap-1 mt-1.5">
                    {FONT_STEP_CLASSES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => update({ fontStep: i })}
                        aria-label={`Text size step ${i + 1}`}
                        className={`w-2 h-2 rounded-full transition-colors ${prefs.fontStep === i ? "bg-[#1077A6]" : "bg-[#1077A6]/20 hover:bg-[#1077A6]/50"}`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() =>
                    update({ fontStep: Math.min(4, prefs.fontStep + 1) })
                  }
                  disabled={prefs.fontStep === 4}
                  aria-label="Increase text size"
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-[#f8f7fc] text-[#1a1550]/60 hover:bg-[#1077A6]/10 hover:text-[#1077A6] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </Section>

            {/* ── 2. Line Spacing ── */}
            <Section
              icon={<AlignJustify className="w-4 h-4" />}
              title="Line Spacing"
            >
              <div className="grid grid-cols-3 gap-1.5">
                {(["default", "relaxed", "loose"] as LineSpacing[]).map((v) => (
                  <SegBtn
                    key={v}
                    active={prefs.lineSpacing === v}
                    onClick={() => update({ lineSpacing: v })}
                    aria-label={`Line spacing: ${v}`}
                  >
                    {v === "default"
                      ? "Normal"
                      : v === "relaxed"
                        ? "Relaxed"
                        : "Loose"}
                  </SegBtn>
                ))}
              </div>
            </Section>

            {/* ── 3. Letter Spacing ── */}
            <Section
              icon={<ScanLine className="w-4 h-4" />}
              title="Letter Spacing"
            >
              <div className="grid grid-cols-3 gap-1.5">
                {(["default", "wide", "wider"] as LetterSpacing[]).map((v) => (
                  <SegBtn
                    key={v}
                    active={prefs.letterSpacing === v}
                    onClick={() => update({ letterSpacing: v })}
                    aria-label={`Letter spacing: ${v}`}
                  >
                    {v === "default"
                      ? "Normal"
                      : v === "wide"
                        ? "Wide"
                        : "Wider"}
                  </SegBtn>
                ))}
              </div>
            </Section>

            {/* ── 4. Colour & Contrast ── */}
            <Section
              icon={<Palette className="w-4 h-4" />}
              title="Colour & Contrast"
            >
              <div className="space-y-1.5">
                <Toggle
                  label="High Contrast"
                  description="Sharpen colours for easier reading"
                  active={prefs.highContrast}
                  onClick={() => update({ highContrast: !prefs.highContrast })}
                  icon={<Contrast className="w-3.5 h-3.5" />}
                />
                <Toggle
                  label="Grayscale"
                  description="Remove all colour"
                  active={prefs.grayscale}
                  onClick={() => update({ grayscale: !prefs.grayscale })}
                  icon={<ScanLine className="w-3.5 h-3.5" />}
                />
                <Toggle
                  label="Invert Colours"
                  description="Reverse light and dark"
                  active={prefs.invertColors}
                  onClick={() => update({ invertColors: !prefs.invertColors })}
                  icon={<Palette className="w-3.5 h-3.5" />}
                />
              </div>
            </Section>

            {/* ── 5. Reading Aids ── */}
            <Section icon={<Link2 className="w-4 h-4" />} title="Reading Aids">
              <div className="space-y-1.5">
                <Toggle
                  label="Highlight Links"
                  description="Add yellow background to all links"
                  active={prefs.highlightLinks}
                  onClick={() =>
                    update({ highlightLinks: !prefs.highlightLinks })
                  }
                  icon={<Link2 className="w-3.5 h-3.5" />}
                />
                <Toggle
                  label="Enhanced Focus"
                  description="Larger focus ring for keyboard nav"
                  active={prefs.enhancedFocus}
                  onClick={() =>
                    update({ enhancedFocus: !prefs.enhancedFocus })
                  }
                  icon={<Focus className="w-3.5 h-3.5" />}
                />
                <Toggle
                  label="Reduce Motion"
                  description="Disable animations & transitions"
                  active={prefs.reduceMotion}
                  onClick={() => update({ reduceMotion: !prefs.reduceMotion })}
                  icon={<Zap className="w-3.5 h-3.5" />}
                />
              </div>
            </Section>

            {/* ── Reset ── */}
            <button
              onClick={reset}
              disabled={!hasChanges}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-semibold border border-[#1077A6]/20 text-[#1077A6] hover:bg-[#1077A6]/8 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset All to Default
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5">
        <span className="text-[#1077A6]/60">{icon}</span>
        <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#1a1550]/50">
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

function SegBtn({
  children,
  active,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  "aria-label"?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className={`py-2 rounded-xl text-[11px] font-semibold transition-colors ${
        active
          ? "bg-[#1077A6] text-white shadow-sm"
          : "bg-[#f8f7fc] text-[#1a1550]/60 hover:bg-[#1077A6]/10 hover:text-[#1077A6]"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({
  label,
  description,
  active,
  onClick,
  icon,
}: {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-colors ${
        active
          ? "bg-[#1077A6] text-white"
          : "bg-[#f8f7fc] text-[#1a1550] hover:bg-[#1077A6]/8"
      }`}
    >
      <span className="flex items-center gap-2 min-w-0">
        <span
          className={`shrink-0 ${active ? "text-white/80" : "text-[#1077A6]/60"}`}
        >
          {icon}
        </span>
        <span className="min-w-0 text-left">
          <span className="block text-[12px] font-semibold leading-none">
            {label}
          </span>
          <span
            className={`block text-[10px] mt-0.5 truncate ${active ? "text-white/60" : "text-[#1a1550]/40"}`}
          >
            {description}
          </span>
        </span>
      </span>
      {/* pill toggle */}
      <span
        className={`shrink-0 w-8 h-4.5 rounded-full relative transition-colors ${active ? "bg-white/30" : "bg-[#1a1550]/15"}`}
        style={{ height: "18px", minWidth: "32px" }}
        aria-hidden="true"
      >
        <span
          className={`absolute top-[3px] w-3 h-3 rounded-full transition-all ${
            active ? "bg-white right-[3px]" : "bg-[#1a1550]/35 left-[3px]"
          }`}
        />
      </span>
    </button>
  );
}
