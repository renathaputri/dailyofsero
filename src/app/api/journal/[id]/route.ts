import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const GUEST_COOKIE_NAME = "sero_guest_id";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const guestId = cookies().get(GUEST_COOKIE_NAME)?.value;

    const entry = await prisma.journalEntry.findUnique({
      where: { id: params.id },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entri jurnal tidak ditemukan." }, { status: 404 });
    }

    // Authorization check: User ID matches, or Admin ID matches guestId, or Guest Cookie matches guestId
    const isOwner =
      (session?.type === "USER" && entry.userId === session.id) ||
      (session?.type === "ADMIN" && (entry.guestId === session.id || entry.guestId === guestId)) ||
      (entry.guestId && entry.guestId === guestId);

    if (!isOwner) {
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
