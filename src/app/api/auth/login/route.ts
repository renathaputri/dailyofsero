import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { loginType, identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/Username dan password wajib diisi ya!" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter ya!" },
        { status: 400 }
      );
    }

    // 1. Jalur Admin / BA (Username)
    if (loginType === "ADMIN") {
      const admin = await prisma.admin.findUnique({
        where: { username: identifier.trim().toLowerCase() },
      });

      if (!admin) {
        return NextResponse.json(
          { error: "Username atau password admin salah nih." },
          { status: 401 }
        );
      }

      const isValid = await verifyPassword(password, admin.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Username atau password admin salah nih." },
          { status: 401 }
        );
      }

      await createSession({
        id: admin.id,
        type: "ADMIN",
        username: admin.username,
        role: admin.role,
        title: admin.title,
        name: admin.name,
      });

      return NextResponse.json({
        success: true,
        redirect: "/admin/dashboard",
        user: {
          id: admin.id,
          type: "ADMIN",
          username: admin.username,
          name: admin.name,
          role: admin.role,
          title: admin.title,
        },
      });
    }

    // 2. Jalur Pengunjung / User (Email atau Username)
    const normalizedIdentifier = identifier.trim().toLowerCase();

    // Try finding by email first, then by username
    let user = await prisma.user.findUnique({
      where: { email: normalizedIdentifier },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: { username: normalizedIdentifier },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Email/username atau password yang kamu masukkan belum cocok." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Email/username atau password yang kamu masukkan belum cocok." },
        { status: 401 }
      );
    }

    await createSession({
      id: user.id,
      type: "USER",
      email: user.email,
      username: user.username,
    });

    return NextResponse.json({
      success: true,
      redirect: "/healing",
      user: {
        id: user.id,
        type: "USER",
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat mencoba login." },
      { status: 500 }
    );
  }
}
