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
      .where(and(eq(staff.active, true), eq(staff.type, "officer")))
      .orderBy(asc(staff.sortOrder));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch officers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch officers." },
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
    const translations = await translateForStorage(body, [
      "name",
      "designation",
      "cadre",
    ]);
    const [item] = await db
      .insert(staff)
      .values({ ...body, type: "officer", translations })
      .returning();
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create officer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create officer." },
      { status: 500 },
    );
  }
}
