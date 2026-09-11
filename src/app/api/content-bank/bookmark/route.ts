import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.type !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await prisma.contentBankBookmark.findMany({
      where: { userId: session.id },
      include: {
        contentBank: {
          include: {
            createdBy: {
              select: { name: true, title: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      bookmarks: bookmarks.map((b) => ({
        id: b.id,
        contentBankId: b.contentBankId,
        content: b.contentBank.content,
        tag: b.contentBank.tag,
        type: b.contentBank.type,
        createdAt: b.createdAt,
        author: b.contentBank.createdBy?.name || "Tim Serotonin",
      })),
    });
  } catch (error) {
    console.error("Fetch bookmarks error:", error);
    return NextResponse.json({ error: "Gagal memuat bookmark." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.type !== "USER") {
      return NextResponse.json({ error: "Silakan login untuk menyimpan bookmark." }, { status: 401 });
    }

    const { contentBankId } = await req.json();
    if (!contentBankId) {
      return NextResponse.json({ error: "ID konten wajib disertakan." }, { status: 400 });
    }

    // Toggle bookmark
    const existing = await prisma.contentBankBookmark.findUnique({
      where: {
        userId_contentBankId: {
          userId: session.id,
          contentBankId,
        },
      },
    });

    if (existing) {
      await prisma.contentBankBookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, bookmarked: false, message: "Bookmark dihapus." });
    } else {
      await prisma.contentBankBookmark.create({
        data: {
          userId: session.id,
          contentBankId,
        },
      });
      return NextResponse.json({ success: true, bookmarked: true, message: "Tersimpan ke bookmark kamu!" });
    }
  } catch (error) {
    console.error("Toggle bookmark error:", error);
    return NextResponse.json({ error: "Gagal memproses bookmark." }, { status: 500 });
  }
}
