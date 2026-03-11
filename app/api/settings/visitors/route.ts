import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/** POST /api/settings/visitors  — increments visitors_count by 1 (one call per session) */
export async function POST() {
  try {
    const [existing] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "visitors_count"))
      .limit(1);

    const current = parseInt(existing?.value ?? "0", 10);
    const newCount = isNaN(current) ? 1 : current + 1;

    if (existing) {
      await db
        .update(siteSettings)
        .set({ value: String(newCount), updatedAt: new Date() })
        .where(eq(siteSettings.key, "visitors_count"));
    } else {
      await db
        .insert(siteSettings)
        .values({ key: "visitors_count", value: "1" });
    }

    return NextResponse.json({ success: true, count: newCount });
  } catch (error) {
    console.error("Failed to track visitor:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

/** PUT /api/settings/visitors  — admin reset / set a specific count */
export async function PUT(request: Request) {
  try {
    const { count } = await request.json();
    const value = String(parseInt(count ?? "0", 10) || 0);

    const [existing] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "visitors_count"))
      .limit(1);

    if (existing) {
      await db
        .update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, "visitors_count"));
    } else {
      await db.insert(siteSettings).values({ key: "visitors_count", value });
    }

    return NextResponse.json({ success: true, count: value });
  } catch (error) {
    console.error("Failed to reset visitor count:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
