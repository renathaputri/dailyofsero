import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendTakedownEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await Promise.resolve(params);

    const karya = await prisma.karya.findUnique({
      where: { id },
    });

    if (!karya) {
      return NextResponse.json({ error: "Karya tidak ditemukan." }, { status: 404 });
    }

    // Only owner or superadmin can edit
    if (karya.ownerId !== session.id && session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Kamu hanya bisa mengedit karya milikmu sendiri." }, { status: 403 });
    }

    const { title, description, category, linkPost, ownerId } = await req.json();

    const data: any = {};
    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description.trim();
    if (category !== undefined) data.category = category;
    if (linkPost !== undefined) data.linkPost = linkPost.trim();
    if (session.role === "SUPERADMIN" && ownerId) {
      data.ownerId = ownerId;
    }

    const updated = await prisma.karya.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            username: true,
            title: true,
            photoUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, karya: updated });
  } catch (error) {
    console.error("Update karya error:", error);
    return NextResponse.json({ error: "Gagal memperbarui karya." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await Promise.resolve(params);

    const karya = await prisma.karya.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!karya) {
      return NextResponse.json({ error: "Karya tidak ditemukan." }, { status: 404 });
    }

    const isSuperadmin = session.role === "SUPERADMIN";
    const isOwner = karya.ownerId === session.id;

    if (!isOwner && !isSuperadmin) {
      return NextResponse.json(
        { error: "Kamu tidak memiliki akses untuk menghapus karya ini." },
        { status: 403 }
      );
    }

    // Handle Superadmin Takedown flow
    if (isSuperadmin && !isOwner) {
      const url = new URL(req.url);
      let reason = url.searchParams.get("reason") || "";

      // In-app notification to BA
      await prisma.notification.create({
        data: {
          adminId: karya.ownerId,
          type: "KARYA_TAKEDOWN",
          message: `Karya kamu "${karya.title}" telah di-takedown oleh Superadmin.${reason ? ` Alasan: ${reason}` : ""}`,
        },
      });

      // Send email notification to BA
      const targetEmail = `${karya.owner.username}@mindspace.internal`;
      await sendTakedownEmail(targetEmail, karya.title, reason);
    }

    // Hard delete
    await prisma.karya.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: isSuperadmin && !isOwner
        ? "Karya berhasil di-takedown dan notifikasi telah dikirimkan ke pemilik karya."
        : "Karya berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete karya error:", error);
    return NextResponse.json({ error: "Gagal menghapus karya." }, { status: 500 });
  }
}
