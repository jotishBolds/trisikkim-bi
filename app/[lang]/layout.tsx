import { notFound } from "next/navigation";
import { isValidLocale, locales, type Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;

  return {
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    other: {
      "og:locale": locale === "hi" ? "hi_IN" : "en_IN",
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  return <>{children}</>;
}
