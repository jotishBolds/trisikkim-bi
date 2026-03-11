import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(pages);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pages." },
      { status: 500 },
    );
  }
}
