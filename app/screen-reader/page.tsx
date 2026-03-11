import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Screen Reader Access | Tribal Research Institute",
  description:
    "Accessibility information and screen reader access for the Tribal Research Institute & Training Centre website.",
};

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

export default function ScreenReaderPage() {
  return (
    <div className="min-h-screen bg-[#f8f7fc]">
      {/* Banner */}
      <div className="bg-[#1077A6] text-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#f4c430]" />
            </div>
            <div>
              <p className="text-[#f4c430] text-xs font-semibold uppercase tracking-widest mb-1">
                Accessibility
              </p>
              <h1 className="font-display font-bold text-2xl md:text-3xl">
                Screen Reader Access
              </h1>
            </div>
          </div>
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
            The Tribal Research Institute & Training Centre is committed to
            making this website accessible to all users, including those with
            disabilities. This page provides information on how to use assistive
            technologies with our site.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-10">
        {/* Accessibility Statement */}
        <section>
          <SectionHeading
            icon={<Globe className="w-5 h-5" />}
            title="Accessibility Statement"
          />
          <div className="bg-white rounded-xl border border-[#1077A6]/10 p-6 text-[#1a1550]/80 text-sm leading-relaxed space-y-3">
            <p>
              This website conforms to the Web Content Accessibility Guidelines
              (WCAG) 2.1 at Level AA. We have designed the site to be usable
              with assistive technologies including screen readers, keyboard
              navigation, and high-contrast displays.
            </p>
            <p>
              If you encounter any accessibility barriers while using this
              website, please contact us and we will make every reasonable
              effort to provide the information in an accessible alternative
              format.
            </p>
          </div>
        </section>

        {/* Screen Reader Software */}
        <section>
          <SectionHeading
            icon={<Volume2 className="w-5 h-5" />}
            title="Screen Reader Software"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {screenReaders.map((sr) => (
              <a
                key={sr.name}
                href={sr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl border border-[#1077A6]/10 p-5 hover:border-[#1077A6]/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-semibold text-[#1a1550] text-sm group-hover:text-[#1077A6] transition-colors">
                    {sr.name}
                  </p>
                  <span className="text-[10px] font-semibold bg-[#1077A6]/10 text-[#1077A6] px-2 py-0.5 rounded-full shrink-0">
                    {sr.platform}
                  </span>
                </div>
                <p className="text-[12px] text-[#1a1550]/60 leading-relaxed">
                  {sr.description}
                </p>
                <p className="mt-3 text-[11px] font-semibold text-[#1077A6] group-hover:text-[#f4c430] transition-colors">
                  Download / Learn more →
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section>
          <SectionHeading
            icon={<Keyboard className="w-5 h-5" />}
            title="Keyboard Navigation"
          />
          <div className="bg-white rounded-xl border border-[#1077A6]/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#1077A6] text-white">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">
                    Keyboard Shortcut
                  </th>
                  <th className="px-5 py-3 text-left font-semibold">Action</th>
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
            title="Browser Accessibility Features"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Zoom / Text Size",
                body: "Use Ctrl + (Windows/Linux) or Cmd + (Mac) to zoom in. Use Ctrl − to zoom out. Most modern browsers support text-only zoom in accessibility settings.",
              },
              {
                title: "High Contrast Mode",
                body: "Enable high contrast in your OS settings (Windows: Settings → Ease of Access → High Contrast). This site's text and interactive elements remain visible in high contrast mode.",
              },
              {
                title: "Browser Extensions",
                body: "Extensions like ChromeVox (Chrome), Accessibility Insights, and WAVE can help evaluate and navigate accessible content in your browser.",
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
            title="Need Help?"
          />
          <div className="bg-[#1077A6]/5 border border-[#1077A6]/15 rounded-xl p-6 text-sm text-[#1a1550]/80 leading-relaxed">
            <p>
              If you experience any difficulty accessing content on this website
              or need information in an alternative accessible format, please
              reach out to us via the{" "}
              <Link
                href="/contact"
                className="text-[#1077A6] font-semibold hover:underline"
              >
                Contact page
              </Link>{" "}
              or send an email. We aim to respond to accessibility requests
              within 2 business days.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

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
