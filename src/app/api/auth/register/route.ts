import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, consent } = body;

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Format email kamu sepertinya kurang tepat nih." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter ya supaya aman." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Kamu perlu menyetujui Kebijakan Privasi & Ketentuan Layanan terlebih dahulu." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email ini sudah terdaftar. Kamu bisa langsung masuk atau reset password ya." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: false,
      },
    });

    // Generate verification token (expires in 24 hours)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        type: "EMAIL_VERIFY",
        expiresAt,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await sendVerificationEmail(user.email, token, appUrl);

    return NextResponse.json({
      success: true,
      message: "Akun berhasil dibuat! Link verifikasi sudah kami kirimkan ke email kamu.",
      verificationLinkPreview: `${appUrl}/verify-email?token=${token}`, // Dev friendly preview
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kendala saat mendaftarkan akunmu. Coba sesaat lagi ya." },
      { status: 500 }
    );
  }
}
