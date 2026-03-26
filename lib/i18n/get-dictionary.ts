import type { Locale } from "./config";

const dictionaries = {
  en: () => import("@/locales/en.json").then((m) => m.default),
  hi: () => import("@/locales/hi.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
