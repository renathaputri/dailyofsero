import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.type !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entry = await prisma.journalEntry.findUnique({
      where: { id: params.id },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entri jurnal tidak ditemukan." }, { status: 404 });
    }

    if (entry.userId !== session.id) {
      return NextResponse.json({ error: "Kamu tidak berhak menghapus jurnal ini." }, { status: 403 });
    }

    await prisma.journalEntry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Entri jurnal berhasil dihapus." });
  } catch (error) {
    console.error("Delete journal error:", error);
    return NextResponse.json({ error: "Gagal menghapus entri jurnal." }, { status: 500 });
  }
}
