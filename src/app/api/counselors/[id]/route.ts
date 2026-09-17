import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN" || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await Promise.resolve(params);
    const body = await req.json();
    const { name, photoUrl, tags } = body;

    const data: { name?: string; photoUrl?: string | null; tags?: string | null } = {};

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return NextResponse.json({ error: "Nama konselor wajib diisi." }, { status: 400 });
      }
      data.name = name.trim();
    }

    if (tags !== undefined) {
      data.tags = tags && tags.trim() ? tags.trim() : null;
    }

    if (photoUrl !== undefined) {
      data.photoUrl = photoUrl && photoUrl.trim() ? photoUrl.trim() : null;
    }

    const updated = await prisma.counselor.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, counselor: updated });
  } catch (error) {
    console.error("Update counselor error:", error);
    return NextResponse.json({ error: "Gagal memperbarui konselor." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN" || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await Promise.resolve(params);
    await prisma.counselor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Konselor berhasil dihapus." });
  } catch (error) {
    console.error("Delete counselor error:", error);
    return NextResponse.json({ error: "Gagal menghapus data konselor." }, { status: 500 });
  }
}
