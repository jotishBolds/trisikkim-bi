import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    const data = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch contact messages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "First name, email, and message are required.",
        },
        { status: 400 },
      );
    }

    const [item] = await db
      .insert(contactMessages)
      .values({ firstName, lastName, email, message })
      .returning();

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit contact message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit message." },
      { status: 500 },
    );
  }
}
