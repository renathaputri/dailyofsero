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
    if (!session || session.type !== "ADMIN" || session.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Hanya Superadmin yang berhak menghapus konten dari Content Bank." },
        { status: 403 }
      );
    }

    await prisma.contentBank.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Konten berhasil dihapus." });
  } catch (error) {
    console.error("Delete content bank error:", error);
    return NextResponse.json({ error: "Gagal menghapus konten." }, { status: 500 });
  }
}
