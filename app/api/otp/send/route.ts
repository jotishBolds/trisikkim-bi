import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { otpTokens } from "@/lib/db/schema";
import { sendOtpEmail } from "@/lib/mailer";
import { eq, and, gt } from "drizzle-orm";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Valid email is required." },
        { status: 400 },
      );
    }

    const now = new Date();
    const sixtySecondsAgo = new Date(now.getTime() - 60 * 1000);

    const existing = await db
      .select()
      .from(otpTokens)
      .where(
        and(
          eq(otpTokens.email, email),
          eq(otpTokens.verified, false),
          gt(otpTokens.expiresAt, now),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      const createdAt = new Date(existing[0].createdAt);
      if (createdAt > sixtySecondsAgo) {
        const secondsLeft = Math.ceil(
          60 - (now.getTime() - createdAt.getTime()) / 1000,
        );
        return NextResponse.json(
          {
            success: false,
            error: `Please wait ${secondsLeft}s before requesting a new OTP.`,
          },
          { status: 429 },
        );
      }
    }

    await db
      .delete(otpTokens)
      .where(and(eq(otpTokens.email, email), eq(otpTokens.verified, false)));

    const otp = generateOtp();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    await db.insert(otpTokens).values({ email, otp, expiresAt });

    await sendOtpEmail(email, otp);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP. Please try again." },
      { status: 500 },
    );
  }
}
