"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  Home,
  Info,
  Users,
  BookOpen,
  ImageIcon,
  Mail,
  Accessibility,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation, langHref } from "@/lib/i18n/use-translation";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";

function getNavData(
  dict: ReturnType<typeof useTranslation>["dict"],
  lang: string,
) {
  const ABOUT_LINKS = [
    { label: dict.nav.aboutUs, href: langHref(lang, "/about") },
    {
      label: dict.nav.organisationChart,
      href: langHref(lang, "/about/organisation-chart"),
    },
    { label: dict.nav.whosWho, href: langHref(lang, "/about/whos-who") },
  ];

  const UPDATES_LINKS = [
    {
      label: dict.nav.trainingWorkshop,
      href: langHref(lang, "/updates/training-workshop"),
    },
    {
      label: dict.nav.newsEvents,
      href: langHref(lang, "/updates/news-events"),
    },
    { label: dict.nav.activities, href: langHref(lang, "/updates/activities") },
    { label: dict.nav.circulars, href: langHref(lang, "/updates/circulars") },
  ];

  const NAV_ITEMS = [
    { label: dict.nav.home, href: langHref(lang, "/"), icon: Home },
    { label: dict.nav.about, href: "#", icon: Info, dropdown: ABOUT_LINKS },
    { label: dict.nav.tribes, href: langHref(lang, "/tribes"), icon: Users },
    {
      label: dict.nav.updates,
      href: "#",
      icon: BookOpen,
      dropdown: UPDATES_LINKS,
    },
    {
      label: dict.nav.gallery,
      href: langHref(lang, "/gallery"),
      icon: ImageIcon,
    },
    { label: dict.nav.contactUs, href: langHref(lang, "/contact"), icon: Mail },
  ] as const;

  return { ABOUT_LINKS, UPDATES_LINKS, NAV_ITEMS };
}

const LOGOS = [
  { src: "/Emblem_of_India.png", alt: "Emblem of India", height: 80 },
  { src: "/main-logo.png", alt: "Government of Sikkim", height: 80 },
];

const RIGHT_LOGOS = [
  { src: "/tribal.png", alt: "TRITC Sikkim", height: 85 },
  { src: "/Sunawlo-Sikkim.webp", alt: "Saamarth Sikkim", height: 75 },
];

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -6,
    scaleY: 0.97,
    transition: { duration: 0.12, ease: "easeInOut" },
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    scaleY: 0.97,
    transition: { duration: 0.12, ease: [0.4, 0, 0.2, 1] },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.045, duration: 0.18, ease: "easeOut" },
  }),
};

function LogoImage({
  src,
  alt,
  height,
  className,
}: {
  src: string;
  alt: string;
  height: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex-shrink-0 flex items-center justify-center",
        className,
      )}
      style={{ height }}
    >
      <Image
        src={src}
        alt={alt}
        height={height}
        width={height}
        className="object-contain h-full w-auto relative z-10"
        unoptimized
      />
    </div>
  );
}

function VDivider() {
  return (
    <div className="hidden md:block h-16 w-px bg-[#322880]/20 mx-4 flex-shrink-0 relative z-10" />
  );
}

export default function Navbar() {
  const { lang, dict } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { NAV_ITEMS } = getNavData(dict, lang);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>(
    {},
  );

  const switchLang = (newLang: Locale) => {
    if (newLang === lang) return;
    // Replace the current locale prefix with the new one
    const rest = pathname.replace(new RegExp(`^/${lang}`), "") || "/";
    document.cookie = `locale=${newLang};path=/;max-age=${365 * 24 * 60 * 60};samesite=lax`;
    router.push(`/${newLang}${rest}`);
  };

  const toggleMobileDropdown = (label: string) => {
    setMobileExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  return (
    <header className="w-full font-body sticky top-0 z-50 shadow-md">
      <div className="bg-[#1077A6] text-white py-1.5 px-4 md:px-8 flex justify-end items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-white/60" />
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              className={cn(
                "text-[11px] tracking-wide px-2 py-0.5 rounded transition-colors duration-200",
                l === lang
                  ? "bg-[#f4c430] text-black font-bold"
                  : "text-white/70 hover:text-[#f4c430]",
              )}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
        <Link
          href={langHref(lang, "/screen-reader")}
          className="flex items-center gap-2 text-[11px] tracking-wide text-white/80 hover:text-[#f4c430] transition-colors duration-200"
        >
          <Accessibility className="w-3.5 h-3.5" />
          {dict.nav.screenReaderAccess}
        </Link>
      </div>

      <div className="bg-white border-b border-[#322880]/10 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-4">
              {LOGOS.map((logo) => (
                <LogoImage
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  height={80}
                />
              ))}
              <VDivider />
              <div>
                <h1 className="font-display font-bold text-[#322880] text-2xl lg:text-2xl leading-tight tracking-tight whitespace-nowrap">
                  {dict.header.instituteName}
                </h1>
                <p className="text-[#322880] text-base lg:text-lg font-medium mt-1 tracking-wide">
                  {dict.header.department}
                </p>
                <p className="text-[#322880] text-sm lg:text-base font-medium tracking-wide">
                  {dict.header.government}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {RIGHT_LOGOS.map((logo) => (
                <LogoImage
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  height={logo.height}
                />
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {LOGOS.map((logo) => (
                  <LogoImage
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    height={50}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                {RIGHT_LOGOS.map((logo) => (
                  <LogoImage
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    height={logo.height === 85 ? 60 : 50}
                  />
                ))}
              </div>
            </div>
            <div className="text-center border-t pt-2 mt-2 border-[#322880]/10">
              <h1 className="font-display font-bold text-[#322880] text-sm leading-tight px-2">
                {dict.header.instituteName}
              </h1>
              <p className="text-[#322880] text-[10px] font-semibold mt-0.5 tracking-wide px-2">
                {dict.header.shortDepartment}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full h-[12px] md:h-[24px] pointer-events-none"
        style={{
          backgroundImage: "url('/main-tri.png')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "center center",
          backgroundBlendMode: "normal",
        }}
      />

      <nav className="bg-[#1077A6] w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="hidden md:flex items-center justify-center">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                active={activeDropdown === item.label}
                onEnter={() =>
                  "dropdown" in item && setActiveDropdown(item.label)
                }
                onLeave={() => setActiveDropdown(null)}
              />
            ))}
          </div>

          <div className="md:hidden flex items-center justify-between py-1.5">
            <div className="text-white/70 text-xs font-medium tracking-wide select-none">
              {dict.nav.navigationMenu}
            </div>
            <button
              className="flex items-center justify-center w-10 h-10 text-white bg-white/10 rounded-lg hover:bg-white/20 active:bg-white/30 transition-all duration-200 touch-manipulation"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="md:hidden bg-gradient-to-b from-[#1077A6] to-[#0e6590] border-t border-white/10 overflow-hidden"
            >
              <div
                className="overflow-y-auto overscroll-contain"
                style={{
                  maxHeight: "calc(100dvh - 200px)",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div className="py-1 pb-6">
                  {NAV_ITEMS.map((item) => {
                    const hasDropdown = "dropdown" in item;
                    const isExpanded = mobileExpanded[item.label] ?? false;

                    if (hasDropdown) {
                      return (
                        <div key={item.label}>
                          <button
                            onClick={() => toggleMobileDropdown(item.label)}
                            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-white border-b border-white/10 hover:bg-white/10 active:bg-white/20 transition-all duration-150 touch-manipulation"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4 text-white/80" />
                              <span className="font-semibold text-sm">
                                {item.label}
                              </span>
                            </div>
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 text-white/60 transition-transform duration-200 flex-shrink-0",
                                isExpanded && "rotate-180",
                              )}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                key={`${item.label}-sub`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.18,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                              >
                                <div className="bg-[#0b5575]/50">
                                  {item.dropdown?.map((sub) => (
                                    <Link
                                      key={sub.label}
                                      href={sub.href}
                                      onClick={() => setMobileOpen(false)}
                                      className="flex items-center gap-3 px-6 py-3 text-white/80 border-b border-white/5 hover:bg-[#f4c430] hover:text-black active:bg-[#f4c430]/80 transition-all duration-150"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#f4c430]/70 flex-shrink-0" />
                                      <span className="text-sm">
                                        {sub.label}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 text-white border-b border-white/10 hover:bg-[#f4c430] hover:text-black active:bg-[#f4c430]/80 transition-all duration-150 touch-manipulation"
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="font-semibold text-sm">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

interface NavItemData {
  label: string;
  href: string;
  icon: React.ElementType;
  dropdown?: { label: string; href: string }[];
}

function NavItem({
  item,
  active,
  onEnter,
  onLeave,
}: {
  item: NavItemData;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const hasDropdown = "dropdown" in item;

  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <Link
        href={item.href}
        className={cn(
          "relative flex items-center gap-2 px-6 py-[14px] text-[14px] font-medium tracking-wide transition-all duration-300 select-none group overflow-hidden",
          active ? "bg-[#f4c430] text-black" : "text-white hover:text-black",
        )}
      >
        <span
          className={cn(
            "absolute inset-0 bg-[#f4c430] transition-all duration-300",
            active
              ? "opacity-100 scale-100"
              : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100",
            "rounded-none",
          )}
        />
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
        <item.icon
          className={cn(
            "w-[15px] h-[15px] relative z-10 transition-all duration-300",
            "group-hover:scale-110 group-hover:rotate-3",
            active ? "text-black" : "text-white/90 group-hover:text-black",
          )}
        />
        <span
          className={cn(
            "relative z-10 transition-all duration-300 font-medium",
            "group-hover:translate-x-0.5",
            active ? "text-black" : "text-white group-hover:text-black",
          )}
        >
          {item.label}
        </span>
        {hasDropdown && (
          <ChevronDown
            className={cn(
              "w-3 h-3 relative z-10 transition-all duration-300",
              "group-hover:translate-y-0.5",
              active
                ? "rotate-180 text-black"
                : "text-white/70 group-hover:text-black group-hover:rotate-180",
            )}
          />
        )}
        <span
          className={cn(
            "absolute bottom-0 left-1/2 right-1/2 h-0.5 bg-[#f4c430] transition-all duration-300",
            "group-hover:left-0 group-hover:right-0",
            active
              ? "left-0 right-0 bg-[#f4c430]"
              : "scale-x-0 group-hover:scale-x-100",
          )}
        />
      </Link>

      <AnimatePresence>
        {hasDropdown && active && (
          <motion.div
            key="dropdown"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 bg-white shadow-2xl border-t-2 border-[#f4c430] min-w-[240px] z-50 overflow-hidden rounded-b-lg"
            style={{ transformOrigin: "top" }}
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#f4c430] via-[#f4c430]/80 to-[#f4c430]" />
            {item.dropdown?.map((sub, i) => (
              <motion.div
                key={sub.label}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href={sub.href}
                  className="group/sub relative block px-5 py-[12px] text-[13px] font-medium text-[#322880] border-b border-gray-100 last:border-0 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#f4c430] to-[#e6b800] opacity-0 group-hover/sub:opacity-100 transition-opacity duration-200" />
                  <span className="absolute left-0 top-1/2 w-0 h-0 bg-[#f4c430] group-hover/sub:w-1 group-hover/sub:h-full group-hover/sub:top-0 transition-all duration-200" />
                  <span className="relative z-10 flex items-center gap-2 pl-2 group-hover/sub:pl-3 transition-all duration-200 group-hover/sub:text-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f4c430] opacity-0 group-hover/sub:opacity-100 transition-all duration-200 group-hover/sub:scale-110 group-hover/sub:shadow-[0_0_8px_rgba(244,196,48,0.6)]" />
                    {sub.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
