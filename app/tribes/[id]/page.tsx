import { notFound } from "next/navigation";
import { TribeDetailContent } from "./tribe-detail-content";
import { db } from "@/lib/db";
import { tribes } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export default async function TribeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const allTribes = await db
    .select()
    .from(tribes)
    .orderBy(asc(tribes.sortOrder));
  const tribe = allTribes.find((t) => t.id === id);

  if (!tribe) {
    notFound();
  }

  const currentIdx = allTribes.findIndex((t) => t.id === tribe.id);
  const prevTribe = currentIdx > 0 ? allTribes[currentIdx - 1] : null;
  const nextTribe =
    currentIdx < allTribes.length - 1 ? allTribes[currentIdx + 1] : null;

  const tribeData = {
    id: tribe.id,
    name: tribe.name,
    heroImage: tribe.heroImage,
    excerpt: tribe.excerpt,
    content: tribe.content,
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
    />
  );
}
