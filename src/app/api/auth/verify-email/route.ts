import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Verifikasi email tidak lagi diperlukan.",
  });
}
