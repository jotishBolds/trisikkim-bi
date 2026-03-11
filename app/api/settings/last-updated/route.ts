import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tribes, updates, pages, siteSettings } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/** GET /api/settings/last-updated  — returns the most recent content update across all tables */
export async function GET() {
  try {
    const results = await Promise.allSettled([
      db.select({ max: sql<string>`MAX(updated_at)` }).from(tribes),
      db.select({ max: sql<string>`MAX(updated_at)` }).from(updates),
      db.select({ max: sql<string>`MAX(updated_at)` }).from(pages),
      db.select({ max: sql<string>`MAX(updated_at)` }).from(siteSettings),
    ]);

    const dates = results
      .filter(
        (r): r is PromiseFulfilledResult<{ max: string }[]> =>
          r.status === "fulfilled" && !!r.value?.[0]?.max,
      )
      .map((r) => new Date(r.value[0].max))
      .filter((d) => !isNaN(d.getTime()));

    const latest =
      dates.length > 0
        ? new Date(Math.max(...dates.map((d) => d.getTime())))
        : new Date();

    const formatted = latest.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return NextResponse.json({
      success: true,
      date: formatted,
      iso: latest.toISOString(),
    });
  } catch (error) {
    console.error("Failed to get last updated:", error);
    return NextResponse.json({ success: false, date: "—" });
  }
}
