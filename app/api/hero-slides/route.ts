import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";
import { translateForStorage } from "@/lib/translate";

export async function GET() {
  try {
    const slides = await db
      .select()
      .from(heroSlides)
      .where(eq(heroSlides.active, true))
      .orderBy(asc(heroSlides.sortOrder));
    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    console.error("Failed to fetch hero slides:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero slides." },
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

    const [slide] = await db
      .insert(heroSlides)
      .values({
        image: body.image,
        headline: body.headline,
        caption: body.caption || "",
        sortOrder: body.sortOrder || 0,
        active: body.active ?? true,
        translations,
      })
      .returning();

    return NextResponse.json({ success: true, data: slide }, { status: 201 });
  } catch (error) {
    console.error("Failed to create hero slide:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create hero slide." },
      { status: 500 },
    );
  }
}
