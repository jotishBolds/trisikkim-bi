import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staff } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, asc, and } from "drizzle-orm";
import { translateForStorage } from "@/lib/translate";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(staff)
      .where(and(eq(staff.active, true), eq(staff.type, "staff")))
      .orderBy(asc(staff.sortOrder));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff." },
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
    const { name, designation, cadre, email, phone, sortOrder, active } = body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Staff name is required." },
        { status: 400 },
      );
    }
    if (
      !designation ||
      typeof designation !== "string" ||
      !designation.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "Designation is required." },
        { status: 400 },
      );
    }
    const translations = await translateForStorage(
      {
        name: name.trim(),
        designation: designation.trim(),
        cadre: cadre ?? "",
      },
      ["name", "designation", "cadre"],
    );
    const [item] = await db
      .insert(staff)
      .values({
        name: name.trim(),
        designation: designation.trim(),
        cadre: cadre ?? null,
        email: email ?? null,
        phone: phone ?? null,
        type: "staff",
        sortOrder: sortOrder ?? 0,
        active: active ?? true,
        translations,
      })
      .returning();
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create staff:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create staff." },
      { status: 500 },
    );
  }
}
