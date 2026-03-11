import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  heroSlides,
  tribes,
  staff,
  galleryCategories,
  galleryImages,
  contactMessages,
  dignitaries,
  updates,
} from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { count, eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const [slidesCount] = await db.select({ count: count() }).from(heroSlides);
    const [tribesCount] = await db.select({ count: count() }).from(tribes);
    const [staffCount] = await db.select({ count: count() }).from(staff);
    const [categoriesCount] = await db
      .select({ count: count() })
      .from(galleryCategories);
    const [imagesCount] = await db
      .select({ count: count() })
      .from(galleryImages);
    const [messagesCount] = await db
      .select({ count: count() })
      .from(contactMessages);
    const [unreadCount] = await db
      .select({ count: count() })
      .from(contactMessages)
      .where(eq(contactMessages.read, false));
    const [dignitariesCount] = await db
      .select({ count: count() })
      .from(dignitaries);
    const [updatesCount] = await db.select({ count: count() }).from(updates);

    return NextResponse.json({
      success: true,
      data: {
        heroSlides: slidesCount.count,
        tribes: tribesCount.count,
        staff: staffCount.count,
        galleryCategories: categoriesCount.count,
        galleryImages: imagesCount.count,
        contactMessages: messagesCount.count,
        unreadMessages: unreadCount.count,
        dignitaries: dignitariesCount.count,
        updates: updatesCount.count,
      },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats." },
      { status: 500 },
    );
  }
}
