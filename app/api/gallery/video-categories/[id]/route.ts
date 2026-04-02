import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { videoGalleryCategories } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { translateForStorage } from "@/lib/translate";

/**
 * PUT - Update video gallery category
 */
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
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.label !== undefined) updateData.label = body.label;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
    if (body.active !== undefined) updateData.active = body.active;

    const translations = await translateForStorage(updateData, [
      "label",
      "description",
    ]);

    const [updated] = await db
      .update(videoGalleryCategories)
      .set({ ...updateData, translations })
      .where(eq(videoGalleryCategories.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update video gallery category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update." },
      { status: 500 },
    );
  }
}

/**
 * DELETE - Delete video gallery category
 */
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
      .delete(videoGalleryCategories)
      .where(eq(videoGalleryCategories.id, parseInt(id)))
      .returning();
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Failed to delete video gallery category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete." },
      { status: 500 },
    );
  }
}
