import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, consent } = body;

    // Validate username
    if (!username || !USERNAME_REGEX.test(username)) {
      return NextResponse.json(
        { error: "Username harus 3-20 karakter, hanya huruf, angka, dan underscore." },
        { status: 400 }
      );
    }

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
    const normalizedUsername = username.trim().toLowerCase();

    // Check existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email ini sudah terdaftar. Kamu bisa langsung masuk atau reset password ya." },
        { status: 409 }
      );
    }

    // Check existing username
    const existingUsername = await prisma.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username ini sudah dipakai. Coba pilih username lain ya." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // Auto-login after registration
    await createSession({
      id: user.id,
      type: "USER",
      email: user.email,
      username: user.username,
    });

    return NextResponse.json({
      success: true,
      message: "Akun berhasil dibuat! Selamat datang di MindSpace 🎉",
      redirect: "/healing",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kendala saat mendaftarkan akunmu. Coba sesaat lagi ya." },
      { status: 500 }
    );
  }
}
