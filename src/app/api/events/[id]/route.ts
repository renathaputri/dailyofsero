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
      return NextResponse.json({ error: "Hanya Superadmin yang berhak mengedit event." }, { status: 403 });
    }

    const { title, description, eventDate, formLink } = await req.json();

    const updated = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: title ? title.trim() : undefined,
        description: description ? description.trim() : undefined,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        formLink: formLink ? formLink.trim() : undefined,
      },
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json({ error: "Gagal memperbarui event." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN" || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Hanya Superadmin yang berhak menghapus event." }, { status: 403 });
    }

    await prisma.event.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Event berhasil dihapus." });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json({ error: "Gagal menghapus event." }, { status: 500 });
  }
}
