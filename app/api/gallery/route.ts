import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryCategories, galleryImages } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const categories = await db
      .select()
      .from(galleryCategories)
      .where(eq(galleryCategories.active, true))
      .orderBy(asc(galleryCategories.sortOrder));

    const images = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.active, true))
      .orderBy(asc(galleryImages.sortOrder));

    const data = categories.map((cat) => ({
      id: cat.id,
      name: cat.label,
      slug: cat.slug,
      description: cat.description,
      images: images.filter((img) => img.categoryId === cat.id),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery." },
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
    const [item] = await db.insert(galleryCategories).values(body).returning();
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create gallery category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create gallery category." },
      { status: 500 },
    );
  }
}
