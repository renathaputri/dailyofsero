import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN" || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, photoUrl } = await req.json();

    const updated = await prisma.counselor.update({
      where: { id: params.id },
      data: {
        name: name ? name.trim() : undefined,
        photoUrl: photoUrl || undefined,
      },
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

    await prisma.counselor.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Konselor berhasil dihapus." });
  } catch (error) {
    console.error("Delete counselor error:", error);
    return NextResponse.json({ error: "Gagal menghapus data konselor." }, { status: 500 });
  }
}
