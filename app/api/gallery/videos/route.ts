import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryVideos } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";
import { translateForStorage } from "@/lib/translate";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const videos = await db
      .select()
      .from(galleryVideos)
      .where(eq(galleryVideos.active, true))
      .orderBy(asc(galleryVideos.sortOrder));

    console.log("[Gallery Videos GET] Found:", videos.length, "videos");

    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    console.error("Failed to fetch gallery videos:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery videos." },
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

    if (!body.title || !body.youtubeUrl) {
      return NextResponse.json(
        { success: false, error: "Title and YouTube URL are required." },
        { status: 400 },
      );
    }

    const translations = await translateForStorage(body, [
      "title",
      "description",
    ]);

    const [item] = await db
      .insert(galleryVideos)
      .values({
        title: body.title,
        youtubeUrl: body.youtubeUrl,
        description: body.description || null,
        sortOrder: body.sortOrder ?? 0,
        active: body.active ?? true,
        translations,
      })
      .returning();

    console.log("[Gallery Videos POST] Created video:", item.id, item.title);

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create gallery video:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create gallery video." },
      { status: 500 },
    );
  }
}
