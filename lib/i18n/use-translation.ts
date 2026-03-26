"use client";

import { usePathname } from "next/navigation";
import { isValidLocale, defaultLocale, type Locale } from "./config";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";

const dicts: Record<Locale, typeof en> = { en, hi };

export type Dictionary = typeof en;

export function useTranslation() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  const lang: Locale = isValidLocale(segment) ? segment : defaultLocale;
  return { lang, dict: dicts[lang] };
}

/** Prefix a path with the current locale */
export function langHref(lang: string, path: string) {
  if (path.startsWith("http") || path.startsWith("#")) return path;
  return `/${lang}${path.startsWith("/") ? path : `/${path}`}`;
}
