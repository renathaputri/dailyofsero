import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ContentType, MoodCategory } from "@prisma/client";

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

    const existingItem = await prisma.contentBank.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Konten tidak ditemukan." }, { status: 404 });
    }

    const isSuperadmin = session.role === "SUPERADMIN";
    const isOwner = existingItem.createdById === session.id;

    if (!isSuperadmin && !isOwner) {
      return NextResponse.json(
        { error: "Kamu tidak memiliki izin untuk mengedit konten ini." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { type, tag, content, createdById } = body;

    const data: {
      type?: ContentType;
      tag?: MoodCategory;
      content?: string;
      createdById?: string;
    } = {};

    if (type) {
      if (type !== ContentType.CALMING_SENTENCE && type !== ContentType.GUIDED_PROMPT) {
        return NextResponse.json({ error: "Tipe konten tidak valid." }, { status: 400 });
      }
      data.type = type;
    }

    if (tag) {
      data.tag = tag;
    }

    if (content !== undefined) {
      if (!content || !content.trim()) {
        return NextResponse.json({ error: "Konten teks tidak boleh kosong." }, { status: 400 });
      }
      data.content = content.trim();
    }

    if (isSuperadmin && createdById) {
      data.createdById = createdById;
    }

    const updated = await prisma.contentBank.update({
      where: { id },
      data,
      include: {
        createdBy: {
          select: { id: true, name: true, title: true, username: true },
        },
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Update content bank error:", error);
    return NextResponse.json({ error: "Gagal memperbarui konten." }, { status: 500 });
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

    const existingItem = await prisma.contentBank.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Konten tidak ditemukan." }, { status: 404 });
    }

    const isSuperadmin = session.role === "SUPERADMIN";
    const isOwner = existingItem.createdById === session.id;

    if (!isSuperadmin && !isOwner) {
      return NextResponse.json(
        { error: "Hanya Superadmin atau pembuat konten yang berhak menghapus konten ini." },
        { status: 403 }
      );
    }

    await prisma.contentBank.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Konten berhasil dihapus." });
  } catch (error) {
    console.error("Delete content bank error:", error);
    return NextResponse.json({ error: "Gagal menghapus konten." }, { status: 500 });
  }
}
