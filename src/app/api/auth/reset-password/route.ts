import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token dan password baru wajib diisi" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter ya!" },
        { status: 400 }
      );
    }

    const verificationRecord = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationRecord || verificationRecord.type !== "PASSWORD_RESET") {
      return NextResponse.json(
        { error: "Tautan reset password tidak valid atau sudah digunakan." },
        { status: 400 }
      );
    }

    if (new Date() > verificationRecord.expiresAt) {
      await prisma.verificationToken.delete({ where: { id: verificationRecord.id } });
      return NextResponse.json(
        { error: "Tautan reset password sudah kadaluarsa. Silakan request ulang ya." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: verificationRecord.userId },
      data: { password: hashedPassword },
    });

    await prisma.verificationToken.delete({
      where: { id: verificationRecord.id },
    });

    return NextResponse.json({
      success: true,
      message: "Password baru kamu sudah aktif! Silakan login kembali.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Gagal mereset kata sandi." },
      { status: 500 }
    );
  }
}
