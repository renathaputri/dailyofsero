import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token verifikasi tidak ditemukan." },
        { status: 400 }
      );
    }

    const verificationRecord = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationRecord || verificationRecord.type !== "EMAIL_VERIFY") {
      return NextResponse.json(
        { error: "Tautan verifikasi tidak valid atau sudah kadaluarsa." },
        { status: 400 }
      );
    }

    if (new Date() > verificationRecord.expiresAt) {
      await prisma.verificationToken.delete({ where: { id: verificationRecord.id } });
      return NextResponse.json(
        { error: "Tautan verifikasi sudah kadaluarsa. Silakan request verifikasi ulang ya." },
        { status: 400 }
      );
    }

    // Activate user
    await prisma.user.update({
      where: { id: verificationRecord.userId },
      data: { isVerified: true },
    });

    // Delete token
    await prisma.verificationToken.delete({
      where: { id: verificationRecord.id },
    });

    return NextResponse.json({
      success: true,
      message: "Email kamu berhasil diverifikasi! Sekarang kamu sudah bisa login 🎉",
    });
  } catch (error) {
    console.error("Email verify error:", error);
    return NextResponse.json(
      { error: "Gagal memverifikasi email." },
      { status: 500 }
    );
  }
}
