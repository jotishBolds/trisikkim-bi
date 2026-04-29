import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryImages, galleryCategories } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { translateForStorage } from "@/lib/translate";

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

    if (!body.categoryId || !body.src) {
      return NextResponse.json(
        { success: false, error: "Category ID and image source are required." },
        { status: 400 },
      );
    }

    // Verify category exists
    const [category] = await db
      .select({ id: galleryCategories.id })
      .from(galleryCategories)
      .where(eq(galleryCategories.id, body.categoryId))
      .limit(1);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: `Category (ID ${body.categoryId}) not found. Create the category first or refresh the page.`,
        },
        { status: 400 },
      );
    }

    // Insert immediately without waiting for translation so the client
    // is not blocked by external Sarvam AI API calls.
    const [item] = await db
      .insert(galleryImages)
      .values({
        categoryId: body.categoryId,
        src: body.src,
        alt: body.alt || "",
        caption: body.caption || null,
        sortOrder: body.sortOrder ?? 0,
        active: body.active ?? true,
        translations: null,
      })
      .returning();

    // Run translation in the background and update the record afterwards.
    translateForStorage(body, ["alt", "caption"])
      .then((translations) => {
        if (translations) {
          return db
            .update(galleryImages)
            .set({ translations })
            .where(eq(galleryImages.id, item.id))
            .execute();
        }
      })
      .catch((err) =>
        console.error("[gallery/images] background translation failed:", err),
      );

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create gallery image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create gallery image." },
      { status: 500 },
    );
  }
}

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
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID required." },
        { status: 400 },
      );
    }
    const [deleted] = await db
      .delete(galleryImages)
      .where(eq(galleryImages.id, parseInt(id)))
      .returning();
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Failed to delete gallery image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete." },
      { status: 500 },
    );
  }
}
