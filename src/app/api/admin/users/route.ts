import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { AdminRole, AdminTitle } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN" || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        title: true,
        photoUrl: true,
        bio: true,
        createdAt: true,
        _count: {
          select: { karya: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Fetch admins error:", error);
    return NextResponse.json({ error: "Gagal memuat daftar admin." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN" || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Hanya Superadmin yang dapat membuat akun admin/BA." }, { status: 403 });
    }

    const { username, password, name, role, title, bio, photoUrl } = await req.json();

    if (!username || !password || !name) {
      return NextResponse.json(
        { error: "Username, password awal, dan nama lengkap wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter ya." },
        { status: 400 }
      );
    }

    const normalizedUsername = username.trim().toLowerCase();

    const existing = await prisma.admin.findUnique({
      where: { username: normalizedUsername },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Username ini sudah dipakai oleh akun admin lain." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = await prisma.admin.create({
      data: {
        username: normalizedUsername,
        password: hashedPassword,
        name: name.trim(),
        role: role || AdminRole.ADMIN,
        title: title || AdminTitle.BA,
        bio: bio || null,
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Akun admin @${newAdmin.username} berhasil dibuat!`,
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        name: newAdmin.name,
        role: newAdmin.role,
        title: newAdmin.title,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json({ error: "Gagal membuat akun admin." }, { status: 500 });
  }
}
