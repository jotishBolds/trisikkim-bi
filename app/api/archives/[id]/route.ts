import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { archives } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { translateForStorage } from "@/lib/translate";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [item] = await db
      .select()
      .from(archives)
      .where(eq(archives.id, Number(id)));

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Failed to fetch archive:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch archive." },
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
    const { title, description, category, pdfUrl, active, publishedAt } = body;

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
      .update(archives)
      .set({
        title,
        description: description ?? null,
        category: category ?? null,
        pdfUrl,
        active: active ?? true,
        translations,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        updatedAt: new Date(),
      })
      .where(eq(archives.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Failed to update archive:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update archive." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
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
    await db.delete(archives).where(eq(archives.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete archive:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete archive." },
      { status: 500 },
    );
  }
}
