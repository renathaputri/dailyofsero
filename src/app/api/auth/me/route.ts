import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    if (session.type === "ADMIN") {
      const admin = await prisma.admin.findUnique({
        where: { id: session.id },
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          title: true,
          photoUrl: true,
          bio: true,
        },
      });

      if (!admin) {
        return NextResponse.json({ user: null });
      }

      return NextResponse.json({
        user: {
          ...session,
          ...admin,
        },
      });
    }

    // User session
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        streak: {
          select: {
            currentStreak: true,
            longestStreak: true,
            lastEntryDate: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        type: "USER",
        username: user.username,
        email: user.email,
        streak: user.streak,
      },
    });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json({ user: null });
  }
}
