import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { archives } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, and, or, like } from "drizzle-orm";
import { translateForStorage } from "@/lib/translate";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const category = searchParams.get("category");
    const year = searchParams.get("year");

    const session = includeInactive ? await auth() : null;
    const skipActiveFilter = includeInactive && !!session?.user;

    const conditions = [];

    if (!skipActiveFilter) {
      conditions.push(eq(archives.active, true));
    }

    if (category) {
      conditions.push(eq(archives.category, category));
    }

    if (year) {
      conditions.push(and(like(archives.publishedAt, `${year}%`)));
    }

    const data = await db
      .select()
      .from(archives)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(archives.publishedAt));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch archives:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch archives." },
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
    const { title, description, category, pdfUrl, active, publishedAt } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 },
      );
    }
    if (!pdfUrl || typeof pdfUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "A PDF file is required." },
        { status: 400 },
      );
    }

    const translations = await translateForStorage(
      { title, description: description ?? "", category: category ?? "" },
      ["title", "description", "category"],
      [],
    );

    const [item] = await db
      .insert(archives)
      .values({
        title,
        description: description ?? null,
        category: category ?? null,
        pdfUrl,
        active: active ?? true,
        translations,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      })
      .returning();

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create archive:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create archive." },
      { status: 500 },
    );
  }
}
