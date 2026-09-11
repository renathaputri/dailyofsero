import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // For security reasons, don't leak user existence
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Jika email terdaftar, link reset password telah kami kirimkan.",
      });
    }

    // Invalidate previous reset tokens
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id, type: "PASSWORD_RESET" },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        type: "PASSWORD_RESET",
        expiresAt,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await sendPasswordResetEmail(user.email, token, appUrl);

    return NextResponse.json({
      success: true,
      message: "Tautan reset password sudah dikirimkan ke email kamu.",
      resetLinkPreview: `${appUrl}/reset-password?token=${token}`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
