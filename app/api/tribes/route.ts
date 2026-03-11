import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tribes } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";

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
    const [item] = await db.insert(tribes).values(body).returning();
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create tribe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tribe." },
      { status: 500 },
    );
  }
}
