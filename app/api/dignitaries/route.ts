import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dignitaries } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";
import { translateForStorage } from "@/lib/translate";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(dignitaries)
      .where(eq(dignitaries.active, true))
      .orderBy(asc(dignitaries.sortOrder));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch dignitaries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dignitaries." },
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
    const { name, role, image, sortOrder, active } = body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 },
      );
    }
    if (!role || typeof role !== "string" || !role.trim()) {
      return NextResponse.json(
        { success: false, error: "Role/designation is required." },
        { status: 400 },
      );
    }
    if (!image || typeof image !== "string" || !image.trim()) {
      return NextResponse.json(
        { success: false, error: "Photo is required." },
        { status: 400 },
      );
    }
    const translations = await translateForStorage(
      { name: name.trim(), role: role.trim() },
      ["name", "role"],
    );
    const [item] = await db
      .insert(dignitaries)
      .values({
        name: name.trim(),
        role: role.trim(),
        image: image.trim(),
        sortOrder: sortOrder ?? 0,
        active: active ?? true,
        translations,
      })
      .returning();
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create dignitary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create dignitary." },
      { status: 500 },
    );
  }
}
