import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staff } from "@/lib/db/schema";
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
    const { id: _id, createdAt: _ca, translations: _tr, ...safeBody } = body;
    const translations = await translateForStorage(safeBody, [
      "name",
      "designation",
      "cadre",
    ]);
    const [updated] = await db
      .update(staff)
      .set({ ...safeBody, translations })
      .where(eq(staff.id, parseInt(id)))
      .returning();
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update officer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update officer." },
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
      .delete(staff)
      .where(eq(staff.id, parseInt(id)))
      .returning();
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Failed to delete officer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete officer." },
      { status: 500 },
    );
  }
}
