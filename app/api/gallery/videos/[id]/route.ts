import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryVideos } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { translateForStorage } from "@/lib/translate";

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
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.youtubeUrl !== undefined) updateData.youtubeUrl = body.youtubeUrl;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
    if (body.active !== undefined) updateData.active = body.active;

    const translations = await translateForStorage(updateData, [
      "title",
      "description",
    ]);

    const [updated] = await db
      .update(galleryVideos)
      .set({ ...updateData, translations })
      .where(eq(galleryVideos.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update gallery video:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update." },
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
    const [deleted] = await db
      .delete(galleryVideos)
      .where(eq(galleryVideos.id, parseInt(id)))
      .returning();
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Failed to delete gallery video:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete." },
      { status: 500 },
    );
  }
}
