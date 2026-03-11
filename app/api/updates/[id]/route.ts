import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updates } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [item] = await db
      .select()
      .from(updates)
      .where(eq(updates.id, parseInt(id)))
      .limit(1);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Failed to fetch update:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch update." },
      { status: 500 },
    );
  }
}

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
    const {
      title,
      category,
      slug,
      excerpt,
      content,
      image,
      active,
      publishedAt,
    } = body;
    const [updated] = await db
      .update(updates)
      .set({
        title,
        category,
        slug,
        excerpt,
        content,
        image,
        active,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(updates.id, parseInt(id)))
      .returning();
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update:", error);
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
      .delete(updates)
      .where(eq(updates.id, parseInt(id)))
      .returning();
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Failed to delete:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete." },
      { status: 500 },
    );
  }
}
