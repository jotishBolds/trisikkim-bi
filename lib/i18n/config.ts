export const locales = ["en", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export const localeNames: Record<Locale, string> = {
  en: "EN",
  hi: "हिन्दी",
};
