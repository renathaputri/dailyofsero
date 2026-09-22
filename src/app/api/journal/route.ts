import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encryptJournal, decryptJournal } from "@/lib/crypto";
import { updateUserStreak } from "@/lib/streak";

export const dynamic = "force-dynamic";

const GUEST_COOKIE_NAME = "sero_guest_id";

function getOrCreateGuestId(): { guestId: string; isNew: boolean } {
  const cookieStore = cookies();
  const existing = cookieStore.get(GUEST_COOKIE_NAME)?.value;
  if (existing) {
    return { guestId: existing, isNew: false };
  }
  const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  return { guestId: newGuestId, isNew: true };
}

export async function GET() {
  try {
    const session = await getSession();
    const { guestId, isNew } = getOrCreateGuestId();

    let whereCondition: any;

    if (session?.type === "USER") {
      whereCondition = {
        OR: [
          { userId: session.id },
          ...(guestId ? [{ guestId }] : []),
        ],
      };
    } else if (session?.type === "ADMIN") {
      whereCondition = {
        OR: [
          { guestId: session.id },
          ...(guestId ? [{ guestId }] : []),
        ],
      };
    } else {
      whereCondition = { guestId };
    }

    const entries = await prisma.journalEntry.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
    });

    const decryptedEntries = entries.map((entry) => ({
      id: entry.id,
      content: decryptJournal(entry.contentEnc),
      createdAt: entry.createdAt,
    }));

    let streak = { currentStreak: 0, longestStreak: 0 };
    if (session?.type === "USER") {
      const userStreak = await prisma.streak.findUnique({
        where: { userId: session.id },
      });
      if (userStreak) {
        streak = {
          currentStreak: userStreak.currentStreak,
          longestStreak: userStreak.longestStreak,
        };
      }
    } else {
      // Guest or admin streak estimated based on active entries count
      const count = decryptedEntries.length;
      streak = {
        currentStreak: count > 0 ? Math.min(count, 30) : 0,
        longestStreak: count > 0 ? Math.min(count, 30) : 0,
      };
    }

    const response = NextResponse.json({
      entries: decryptedEntries,
      streak,
    });

    if (isNew) {
      response.cookies.set(GUEST_COOKIE_NAME, guestId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: "lax",
        httpOnly: true,
      });
    }

    return response;
  } catch (error) {
    console.error("Fetch journal error:", error);
    return NextResponse.json({ error: "Gagal memuat jurnal." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const { guestId, isNew } = getOrCreateGuestId();

    const { content } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Isi jurnal tidak boleh kosong ya." }, { status: 400 });
    }

    // Encrypt at rest with AES-256-GCM
    const contentEnc = encryptJournal(content.trim());

    let newEntry;
    let streakResult = { currentStreak: 1, longestStreak: 1 };

    if (session?.type === "USER") {
      newEntry = await prisma.journalEntry.create({
        data: {
          userId: session.id,
          guestId,
          contentEnc,
        },
      });

      // Update user streak in DB
      try {
        streakResult = await updateUserStreak(session.id);
      } catch (err) {
        console.error("Failed to update user streak:", err);
      }
    } else if (session?.type === "ADMIN") {
      newEntry = await prisma.journalEntry.create({
        data: {
          guestId: session.id,
          contentEnc,
        },
      });
    } else {
      // Guest / unauthenticated
      newEntry = await prisma.journalEntry.create({
        data: {
          guestId,
          contentEnc,
        },
      });
    }

    const response = NextResponse.json({
      success: true,
      entry: {
        id: newEntry.id,
        content: content.trim(),
        createdAt: newEntry.createdAt,
      },
      streak: streakResult,
    });

    if (isNew) {
      response.cookies.set(GUEST_COOKIE_NAME, guestId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: "lax",
        httpOnly: true,
      });
    }

    return response;
  } catch (error) {
    console.error("Create journal error:", error);
    return NextResponse.json({ error: "Gagal menyimpan jurnal." }, { status: 500 });
  }
}
