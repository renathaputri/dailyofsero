import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ContentType, MoodCategory } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as ContentType | null;
    const tag = searchParams.get("tag") as MoodCategory | null;
    const quoteOfTheDay = searchParams.get("qotd") === "true";

    // Quote of the day: deterministic pick from CALMING_SENTENCE based on today's date
    if (quoteOfTheDay) {
      const calmingQuotes = await prisma.contentBank.findMany({
        where: { type: ContentType.CALMING_SENTENCE },
        include: {
          createdBy: {
            select: { name: true, title: true },
          },
        },
      });

      if (calmingQuotes.length === 0) {
        return NextResponse.json({
          quote: {
            content: "Setiap langkah kecil adalah kemenangan. Tetaplah ramah pada dirimu hari ini. ✨",
            author: "Tim Serotonin",
          },
        });
      }

      // Date seed: YYYY-MM-DD
      const todayStr = new Date().toISOString().slice(0, 10);
      let hash = 0;
      for (let i = 0; i < todayStr.length; i++) {
        hash = (hash << 5) - hash + todayStr.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % calmingQuotes.length;
      const selected = calmingQuotes[index];

      return NextResponse.json({
        quote: {
          id: selected.id,
          content: selected.content,
          tag: selected.tag,
          author: selected.createdBy?.name || "Tim Serotonin",
        },
      });
    }

    const whereClause: any = {};
    if (type) whereClause.type = type;
    if (tag) whereClause.tag = tag;

    const items = await prisma.contentBank.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: { id: true, name: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Check user bookmarks if session exists
    const session = await getSession();
    let bookmarkedIds: string[] = [];

    if (session && session.type === "USER") {
      const userBookmarks = await prisma.contentBankBookmark.findMany({
        where: { userId: session.id },
        select: { contentBankId: true },
      });
      bookmarkedIds = userBookmarks.map((b) => b.contentBankId);
    }

    const result = items.map((item) => ({
      ...item,
      isBookmarked: bookmarkedIds.includes(item.id),
    }));

    return NextResponse.json({ items: result });
  } catch (error) {
    console.error("Content Bank fetch error:", error);
    return NextResponse.json({ error: "Gagal memuat Content Bank." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN") {
      return NextResponse.json({ error: "Hanya Tim Admin/BA yang dapat menambah ke Content Bank." }, { status: 403 });
    }

    const body = await req.json();
    const { type, content, tag } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Konten tidak boleh kosong." }, { status: 400 });
    }

    const newItem = await prisma.contentBank.create({
      data: {
        type: type || ContentType.CALMING_SENTENCE,
        content: content.trim(),
        tag: tag || MoodCategory.TENANG,
        createdById: session.id,
      },
      include: {
        createdBy: { select: { name: true, title: true } },
      },
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error("Content bank create error:", error);
    return NextResponse.json({ error: "Gagal menambahkan konten." }, { status: 500 });
  }
}
