import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tribes } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [tribe] = await db
      .select()
      .from(tribes)
      .where(eq(tribes.id, id))
      .limit(1);
    if (!tribe) {
      return NextResponse.json(
        { success: false, error: "Tribe not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: tribe });
  } catch (error) {
    console.error("Failed to fetch tribe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tribe." },
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
      name,
      image,
      excerpt,
      content,
      accent,
      heroImage,
      sections,
      gallery,
      sortOrder,
      active,
    } = body;
    const [updated] = await db
      .update(tribes)
      .set({
        name,
        image,
        excerpt,
        content,
        accent,
        heroImage,
        sections,
        gallery: gallery ?? [],
        sortOrder,
        active,
        updatedAt: new Date(),
      })
      .where(eq(tribes.id, id))
      .returning();
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Tribe not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update tribe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update tribe." },
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
      .delete(tribes)
      .where(eq(tribes.id, id))
      .returning();
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Tribe not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Failed to delete tribe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete tribe." },
      { status: 500 },
    );
  }
}
