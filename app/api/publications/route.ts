import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publications } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, and } from "drizzle-orm";
import { translateForStorage } from "@/lib/translate";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const session = includeInactive ? await auth() : null;
    const skipActiveFilter = includeInactive && !!session?.user;

    const conditions = skipActiveFilter ? [] : [eq(publications.active, true)];

    const data = await db
      .select()
      .from(publications)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(publications.publishedAt));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch publications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch publications." },
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
    const { title, description, pdfUrl, active, publishedAt } = body;

    if (!pdfUrl || typeof pdfUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "A PDF file is required." },
        { status: 400 },
      );
    }

    const translations = await translateForStorage(
      { title, description: description ?? "" },
      ["title", "description"],
      [],
    );

    const [item] = await db
      .insert(publications)
      .values({
        title,
        description: description ?? null,
        pdfUrl,
        active: active ?? true,
        translations,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      })
      .returning();

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create publication:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create publication." },
      { status: 500 },
    );
  }
}
