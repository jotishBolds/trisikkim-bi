import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updates } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const includeInactive = searchParams.get("includeInactive") === "true";

    // Only allow includeInactive for authenticated admin requests
    const session = includeInactive ? await auth() : null;
    const skipActiveFilter = includeInactive && !!session?.user;

    const conditions = skipActiveFilter ? [] : [eq(updates.active, true)];
    if (category) {
      conditions.push(eq(updates.category, category));
    }

    const data = await db
      .select()
      .from(updates)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(updates.publishedAt));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch updates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch updates." },
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
    const {
      title,
      category,
      slug,
      excerpt,
      content,
      image,
      active,
      publishedAt,
    } = body;
    const [item] = await db
      .insert(updates)
      .values({
        title,
        category,
        slug,
        excerpt,
        content,
        image,
        active,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      })
      .returning();
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create update:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create update." },
      { status: 500 },
    );
  }
}
