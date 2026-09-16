import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encryptJournal, decryptJournal } from "@/lib/crypto";
import { updateUserStreak } from "@/lib/streak";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.type !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await prisma.journalEntry.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
    });

    const decryptedEntries = entries.map((entry) => ({
      id: entry.id,
      content: decryptJournal(entry.contentEnc),
      createdAt: entry.createdAt,
    }));

    const streak = await prisma.streak.findUnique({
      where: { userId: session.id },
    });

    return NextResponse.json({
      entries: decryptedEntries,
      streak: streak || { currentStreak: 0, longestStreak: 0 },
    });
  } catch (error) {
    console.error("Fetch journal error:", error);
    return NextResponse.json({ error: "Gagal memuat jurnal." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.type !== "USER") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu untuk menulis jurnal." }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Isi jurnal tidak boleh kosong ya." }, { status: 400 });
    }

    // Encrypt at rest
    const contentEnc = encryptJournal(content.trim());

    const newEntry = await prisma.journalEntry.create({
      data: {
        userId: session.id,
        contentEnc,
      },
    });

    // Update streak
    const streakResult = await updateUserStreak(session.id);

    return NextResponse.json({
      success: true,
      entry: {
        id: newEntry.id,
        content: content.trim(),
        createdAt: newEntry.createdAt,
      },
      streak: streakResult,
    });
  } catch (error) {
    console.error("Create journal error:", error);
    return NextResponse.json({ error: "Gagal menyimpan jurnal." }, { status: 500 });
  }
}
