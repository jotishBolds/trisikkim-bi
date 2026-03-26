import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { tribes } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { TribeDetailContent } from "./tribe-detail-content";

export default async function TribeDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;

  if (!isValidLocale(lang)) notFound();

  const allTribes = await db
    .select()
    .from(tribes)
    .orderBy(asc(tribes.sortOrder));
  const tribe = allTribes.find((t) => t.id === id);

  if (!tribe) notFound();

  const currentIdx = allTribes.findIndex((t) => t.id === tribe.id);
  const prevTribe = currentIdx > 0 ? allTribes[currentIdx - 1] : null;
  const nextTribe =
    currentIdx < allTribes.length - 1 ? allTribes[currentIdx + 1] : null;

  // Use stored translations from DB if available
  const tr = tribe.translations as
    | { hi?: { name?: string; excerpt?: string; content?: string } }
    | null
    | undefined;
  const useHi = lang !== "en" && tr?.hi;

  const tribeData = {
    id: tribe.id,
    name: useHi ? tr!.hi!.name || tribe.name : tribe.name,
    heroImage: tribe.heroImage,
    excerpt: useHi ? tr!.hi!.excerpt || tribe.excerpt : tribe.excerpt,
    content: useHi ? tr!.hi!.content || tribe.content : tribe.content,
    gallery: (tribe.gallery as Array<{ url: string; label: string }>) ?? [],
  };

  const prevData = prevTribe
    ? { id: prevTribe.id, name: prevTribe.name }
    : null;
  const nextData = nextTribe
    ? { id: nextTribe.id, name: nextTribe.name }
    : null;

  return (
    <TribeDetailContent
      tribe={tribeData}
      prevTribe={prevData}
      nextTribe={nextData}
      lang={lang as Locale}
    />
  );
}
