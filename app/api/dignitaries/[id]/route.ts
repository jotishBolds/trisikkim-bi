import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dignitaries } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, createdAt: _ca, updatedAt: _ua, ...safeBody } = body;
    const [updated] = await db
      .update(dignitaries)
      .set(safeBody)
      .where(eq(dignitaries.id, parseInt(id)))
      .returning();
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update dignitary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update dignitary." },
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
      .delete(dignitaries)
      .where(eq(dignitaries.id, parseInt(id)))
      .returning();
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Failed to delete dignitary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete dignitary." },
      { status: 500 },
    );
  }
}
