import { NextResponse } from "next/server";

export async function GET() {
  const enabled = process.env.ENABLE_REGISTRATION === "true";
  return NextResponse.json({ enabled });
}
