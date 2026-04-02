import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { videoGalleryCategories } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";
import { translateForStorage } from "@/lib/translate";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET all video gallery categories (filtered by active status if not admin)
 */
export async function GET() {
  try {
    const categories = await db
      .select()
      .from(videoGalleryCategories)
      .where(eq(videoGalleryCategories.active, true))
      .orderBy(asc(videoGalleryCategories.sortOrder));

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Failed to fetch video gallery categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch video gallery categories." },
      { status: 500 },
    );
  }
}

/**
 * POST - Create new video gallery category (admin only)
 */
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

    if (!body.slug || !body.label) {
      return NextResponse.json(
        { success: false, error: "Slug and label are required." },
        { status: 400 },
      );
    }

    const translations = await translateForStorage(body, [
      "label",
      "description",
    ]);

    const [item] = await db
      .insert(videoGalleryCategories)
      .values({
        slug: body.slug,
        label: body.label,
        description: body.description || null,
        sortOrder: body.sortOrder ?? 0,
        active: body.active ?? true,
        translations,
      })
      .returning();

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create video gallery category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create video gallery category." },
      { status: 500 },
    );
  }
}
