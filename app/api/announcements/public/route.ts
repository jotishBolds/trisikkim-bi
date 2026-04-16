import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(announcements)
      .where(eq(announcements.active, true))
      .orderBy(asc(announcements.sortOrder));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcements." },
      { status: 500 },
    );
  }
}
