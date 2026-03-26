"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Monitor,
  Keyboard,
  Eye,
  Globe,
  Volume2,
  ZoomIn,
} from "lucide-react";
import { useTranslation, langHref } from "@/lib/i18n/use-translation";

const screenReaders = [
  {
    name: "JAWS (Job Access With Speech)",
    platform: "Windows",
    url: "https://www.freedomscientific.com/products/software/jaws/",
    description:
      "Industry-leading screen reader for Windows with advanced features for enterprise use.",
  },
  {
    name: "NVDA (NonVisual Desktop Access)",
    platform: "Windows",
    url: "https://www.nvaccess.org/",
    description:
      "Free and open-source screen reader for Windows, widely used worldwide.",
  },
  {
    name: "VoiceOver",
    platform: "macOS / iOS",
    url: "https://www.apple.com/accessibility/vision/",
    description:
      "Built-in screen reader that comes with all Apple devices at no extra cost.",
  },
  {
    name: "TalkBack",
    platform: "Android",
    url: "https://support.google.com/accessibility/android/answer/6007100",
    description: "Google's built-in screen reader for Android devices.",
  },
  {
    name: "Orca Screen Reader",
    platform: "Linux",
    url: "https://help.gnome.org/users/orca/stable/",
    description:
      "Free, open-source screen reader for the GNOME desktop environment.",
  },
];

const shortcuts = [
  { key: "Tab", action: "Move to the next focusable element" },
  { key: "Shift + Tab", action: "Move to the previous focusable element" },
  { key: "Enter / Space", action: "Activate a button or link" },
  { key: "Arrow Keys", action: "Navigate within menus, tabs, or carousels" },
  { key: "Escape", action: "Close dialogs or menus" },
  { key: "Alt + Left", action: "Go back to the previous page" },
  { key: "Ctrl + Home", action: "Jump to the top of the page" },
  { key: "Ctrl + End", action: "Jump to the bottom of the page" },
];

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-[#1077A6]/10 flex items-center justify-center text-[#1077A6]">
        {icon}
      </div>
      <h2 className="font-display font-bold text-[#1a1550] text-lg">{title}</h2>
    </div>
  );
}

export default function ScreenReaderPage() {
  const { lang, dict } = useTranslation();
  const sr = dict.screenReader;

  return (
    <div className="min-h-screen bg-[#f8f7fc]">
      {/* Banner */}
      <div className="bg-[#1077A6] text-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <Link
            href={langHref(lang, "/")}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {dict.common.backToHome}
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#f4c430]" />
            </div>
            <div>
              <p className="text-[#f4c430] text-xs font-semibold uppercase tracking-widest mb-1">
                {sr.subtitle}
              </p>
              <h1 className="font-display font-bold text-2xl md:text-3xl">
                {sr.title}
              </h1>
            </div>
          </div>
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
            {sr.description}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-10">
        {/* Accessibility Statement */}
        <section>
          <SectionHeading
            icon={<Globe className="w-5 h-5" />}
            title={sr.accessibilityStatement}
          />
          <div className="bg-white rounded-xl border border-[#1077A6]/10 p-6 text-[#1a1550]/80 text-sm leading-relaxed space-y-3">
            <p>{sr.statementP1}</p>
            <p>{sr.statementP2}</p>
          </div>
        </section>

        {/* Screen Reader Software */}
        <section>
          <SectionHeading
            icon={<Volume2 className="w-5 h-5" />}
            title={sr.screenReaderSoftware}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {screenReaders.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl border border-[#1077A6]/10 p-5 hover:border-[#1077A6]/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-semibold text-[#1a1550] text-sm group-hover:text-[#1077A6] transition-colors">
                    {item.name}
                  </p>
                  <span className="text-[10px] font-semibold bg-[#1077A6]/10 text-[#1077A6] px-2 py-0.5 rounded-full shrink-0">
                    {item.platform}
                  </span>
                </div>
                <p className="text-[12px] text-[#1a1550]/60 leading-relaxed">
                  {item.description}
                </p>
                <p className="mt-3 text-[11px] font-semibold text-[#1077A6] group-hover:text-[#f4c430] transition-colors">
                  {sr.downloadLearnMore}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section>
          <SectionHeading
            icon={<Keyboard className="w-5 h-5" />}
            title={sr.keyboardNavigation}
          />
          <div className="bg-white rounded-xl border border-[#1077A6]/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#1077A6] text-white">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">
                    {sr.keyboardShortcut}
                  </th>
                  <th className="px-5 py-3 text-left font-semibold">
                    {sr.action}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1077A6]/8">
                {shortcuts.map((s) => (
                  <tr key={s.key} className="hover:bg-[#f8f7fc]">
                    <td className="px-5 py-3">
                      <kbd className="font-mono text-xs font-semibold bg-[#1a1550]/8 text-[#1a1550] px-2 py-0.5 rounded border border-[#1a1550]/15">
                        {s.key}
                      </kbd>
                    </td>
                    <td className="px-5 py-3 text-[#1a1550]/70">{s.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Browser Accessibility Features */}
        <section>
          <SectionHeading
            icon={<ZoomIn className="w-5 h-5" />}
            title={sr.browserFeatures}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: sr.zoomTitle,
                body: sr.zoomDescription,
              },
              {
                title: sr.highContrastTitle,
                body: sr.highContrastDescription,
              },
              {
                title: sr.textToSpeechTitle,
                body: sr.textToSpeechDescription,
              },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white rounded-xl border border-[#1077A6]/10 p-5"
              >
                <p className="font-semibold text-[#1a1550] text-sm mb-2">
                  {c.title}
                </p>
                <p className="text-[12px] text-[#1a1550]/60 leading-relaxed">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <SectionHeading
            icon={<Monitor className="w-5 h-5" />}
            title={lang === "hi" ? "सहायता चाहिए?" : "Need Help?"}
          />
          <div className="bg-[#1077A6]/5 border border-[#1077A6]/15 rounded-xl p-6 text-sm text-[#1a1550]/80 leading-relaxed">
            <p>
              {lang === "hi"
                ? "यदि आपको इस वेबसाइट पर सामग्री तक पहुँचने में कोई कठिनाई हो या आपको वैकल्पिक सुलभ प्रारूप में जानकारी चाहिए, तो कृपया हमसे संपर्क करें।"
                : "If you experience any difficulty accessing content on this website or need information in an alternative accessible format, please reach out to us via the"}{" "}
              <Link
                href={langHref(lang, "/contact")}
                className="text-[#1077A6] font-semibold hover:underline"
              >
                {dict.nav.contactUs}
              </Link>
              {lang === "hi"
                ? " पृष्ठ।"
                : " page or send an email. We aim to respond to accessibility requests within 2 business days."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
