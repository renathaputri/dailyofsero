import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN" || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { username, name, role, title, newPassword, bio, photoUrl } = await req.json();

    const updateData: any = {};

    if (username) {
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      if (cleanUsername.length < 3) {
        return NextResponse.json(
          { error: "Username minimal 3 karakter (hanya huruf kecil, angka, dan garis bawah _)." },
          { status: 400 }
        );
      }

      // Check duplicate
      const existing = await prisma.admin.findUnique({
        where: { username: cleanUsername },
      });
      if (existing && existing.id !== params.id) {
        return NextResponse.json(
          { error: `Username @${cleanUsername} sudah digunakan oleh akun lain.` },
          { status: 400 }
        );
      }

      updateData.username = cleanUsername;
    }

    if (name) updateData.name = name.trim();
    if (role) updateData.role = role;
    if (title) updateData.title = title;
    if (bio !== undefined) updateData.bio = bio;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;

    let passwordWasReset = false;
    if (newPassword && newPassword.trim().length >= 6) {
      updateData.password = await hashPassword(newPassword.trim());
      passwordWasReset = true;
    }

    const updated = await prisma.admin.update({
      where: { id: params.id },
      data: updateData,
    });

    // If password was reset by superadmin, send in-app notification to this Admin (PRD 3.1 & 3.8)
    if (passwordWasReset) {
      await prisma.notification.create({
        data: {
          adminId: updated.id,
          type: "PASSWORD_RESET",
          message: "Kata sandi akun admin kamu telah diatur ulang oleh Superadmin.",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: passwordWasReset
        ? `Password untuk @${updated.username} berhasil direset dan notifikasi in-app telah dikirimkan.`
        : "Data akun berhasil diperbarui.",
      admin: {
        id: updated.id,
        username: updated.username,
        name: updated.name,
        role: updated.role,
        title: updated.title,
      },
    });
  } catch (error) {
    console.error("Update admin error:", error);
    return NextResponse.json({ error: "Gagal memperbarui akun admin." }, { status: 500 });
  }
}
