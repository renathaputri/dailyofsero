import { NextResponse } from "next/server";
import { getSession, destroySession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.type !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password } = await req.json();
    if (!password) {
      return NextResponse.json(
        { error: "Masukkan kata sandimu untuk mengonfirmasi penghapusan akun." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Password yang kamu masukkan salah." }, { status: 400 });
    }

    // Hard delete user (onDelete: Cascade in Prisma will cascade-delete all journals, bookmarks, streak, tokens, notifications)
    await prisma.user.delete({
      where: { id: session.id },
    });

    await destroySession();

    return NextResponse.json({
      success: true,
      message: "Seluruh data akunmu telah berhasil dihapus secara permanen. Terima kasih telah bertumbuh bersama Sero.",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus akun. Coba sesaat lagi." },
      { status: 500 }
    );
  }
}
