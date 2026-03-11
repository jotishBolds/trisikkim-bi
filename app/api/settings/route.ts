import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (!key)
      return NextResponse.json(
        { success: false, error: "Key required" },
        { status: 400 },
      );

    await db.delete(siteSettings).where(eq(siteSettings.key, key));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete setting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const data = await db.select().from(siteSettings);
    const settings: Record<string, string> = {};
    for (const s of data) {
      settings[s.key] = s.value;
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    const body = await request.json();
    const entries = Object.entries(body) as Array<[string, string]>;

    for (const [key, value] of entries) {
      const existing = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);
      if (existing.length === 0) {
        await db.insert(siteSettings).values({ key, value });
      } else {
        await db
          .update(siteSettings)
          .set({ value, updatedAt: new Date() })
          .where(eq(siteSettings.key, key));
      }
    }

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings." },
      { status: 500 },
    );
  }
}
