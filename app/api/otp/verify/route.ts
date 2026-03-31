import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { otpTokens } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and OTP are required." },
        { status: 400 },
      );
    }

    const now = new Date();

    const [token] = await db
      .select()
      .from(otpTokens)
      .where(
        and(
          eq(otpTokens.email, email),
          eq(otpTokens.otp, otp),
          eq(otpTokens.verified, false),
          gt(otpTokens.expiresAt, now),
        ),
      )
      .limit(1);

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP." },
        { status: 400 },
      );
    }

    await db
      .update(otpTokens)
      .set({ verified: true })
      .where(eq(otpTokens.id, token.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify OTP." },
      { status: 500 },
    );
  }
}
