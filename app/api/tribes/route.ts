import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tribes } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";
import { translateForStorage } from "@/lib/translate";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(tribes)
      .where(eq(tribes.active, true))
      .orderBy(asc(tribes.sortOrder));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch tribes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tribes." },
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
    const {
      id,
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
    if (!id || typeof id !== "string" || !id.trim()) {
      return NextResponse.json(
        { success: false, error: "Tribe ID is required." },
        { status: 400 },
      );
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Tribe name is required." },
        { status: 400 },
      );
    }
    if (!heroImage || typeof heroImage !== "string" || !heroImage.trim()) {
      return NextResponse.json(
        { success: false, error: "Hero banner image is required." },
        { status: 400 },
      );
    }
    if (!excerpt || typeof excerpt !== "string" || !excerpt.trim()) {
      return NextResponse.json(
        { success: false, error: "Short excerpt is required." },
        { status: 400 },
      );
    }
    const translations = await translateForStorage(
      { name, excerpt, content: content ?? "" },
      ["name", "excerpt"],
      ["content"],
    );
    const [item] = await db
      .insert(tribes)
      .values({
        id: id.trim(),
        name: name.trim(),
        image: image ?? "",
        excerpt: excerpt.trim(),
        content: content ?? "",
        accent: accent ?? "#1077A6",
        heroImage: heroImage.trim(),
        sections: sections ?? [],
        gallery: gallery ?? [],
        sortOrder: sortOrder ?? 0,
        active: active ?? true,
        translations,
      })
      .returning();
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create tribe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tribe." },
      { status: 500 },
    );
  }
}
