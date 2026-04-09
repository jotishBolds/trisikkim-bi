import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
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

    if (body.caption && body.caption.trim().length < 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Caption must be at least 100 characters long.",
        },
        { status: 400 },
      );
    }

    const translations = await translateForStorage(body, [
      "headline",
      "caption",
    ]);

    const [updated] = await db
      .update(heroSlides)
      .set({
        image: body.image,
        headline: body.headline,
        caption: body.caption || "",
        sortOrder: body.sortOrder || 0,
        active: body.active ?? true,
        translations,
      })
      .where(eq(heroSlides.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Slide not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update hero slide:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update hero slide." },
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
      .delete(heroSlides)
      .where(eq(heroSlides.id, parseInt(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Slide not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Failed to delete hero slide:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete hero slide." },
      { status: 500 },
    );
  }
}
