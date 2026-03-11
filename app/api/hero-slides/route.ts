import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const slides = await db
      .select()
      .from(heroSlides)
      .where(eq(heroSlides.active, true))
      .orderBy(asc(heroSlides.sortOrder));
    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    console.error("Failed to fetch hero slides:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero slides." },
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
    const [slide] = await db.insert(heroSlides).values(body).returning();
    return NextResponse.json({ success: true, data: slide }, { status: 201 });
  } catch (error) {
    console.error("Failed to create hero slide:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create hero slide." },
      { status: 500 },
    );
  }
}
