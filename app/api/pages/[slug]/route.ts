import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { translateText, translateHtml } from "@/lib/translate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const [page] = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slug))
      .limit(1);
    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("Failed to fetch page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    const { slug } = await params;
    const body = await request.json();

    // Translate page content for Hindi
    const pageTitle = body.title || slug;
    const contentObj = body.content || {};
    const htmlContent =
      typeof contentObj.content === "string" ? contentObj.content : "";

    let translations: Record<string, Record<string, string>> | null = null;
    try {
      const hi: Record<string, string> = {};
      if (pageTitle) hi.title = await translateText(pageTitle, "hi");
      if (htmlContent) hi.content = await translateHtml(htmlContent, "hi");
      if (Object.keys(hi).length > 0) translations = { hi };
    } catch {
      // translation failure is non-blocking
    }

    // Upsert: create if not exists, update if exists
    const existing = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slug))
      .limit(1);

    if (existing.length === 0) {
      const [created] = await db
        .insert(pages)
        .values({
          slug,
          title: pageTitle,
          content: contentObj,
          translations,
        })
        .returning();
      return NextResponse.json(
        { success: true, data: created },
        { status: 201 },
      );
    }

    const [updated] = await db
      .update(pages)
      .set({ ...body, translations, updatedAt: new Date() })
      .where(eq(pages.slug, slug))
      .returning();

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update page." },
      { status: 500 },
    );
  }
}
