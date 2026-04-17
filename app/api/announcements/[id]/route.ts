import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID." },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(announcements)
      .set({
        title: body.title.trim(),
        link: body.link?.trim() || null,
        active: body.active ?? true,
        sortOrder: body.sortOrder ?? 0,
        translations: body.translations ?? null,
      })
      .where(eq(announcements.id, numericId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Announcement not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update announcement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update announcement." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID." },
        { status: 400 },
      );
    }

    const [deleted] = await db
      .delete(announcements)
      .where(eq(announcements.id, numericId))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Announcement not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete announcement." },
      { status: 500 },
    );
  }
}
