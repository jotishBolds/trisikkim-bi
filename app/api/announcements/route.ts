import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(announcements)
      .orderBy(asc(announcements.sortOrder));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcements." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 },
      );
    }

    const [item] = await db
      .insert(announcements)
      .values({
        title: body.title.trim(),
        link: body.link?.trim() || null,
        active: body.active ?? true,
        sortOrder: body.sortOrder ?? 0,
        translations: body.translations ?? null,
      })
      .returning();

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create announcement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create announcement." },
      { status: 500 },
    );
  }
}
