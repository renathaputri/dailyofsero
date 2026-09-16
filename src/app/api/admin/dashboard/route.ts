import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ContentType, AdminTitle } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperadmin = session.role === "SUPERADMIN";

    // Common BA data
    const myKaryaCount = await prisma.karya.count({
      where: { ownerId: session.id },
    });

    const myNotificationsCount = await prisma.notification.count({
      where: { adminId: session.id, isRead: false },
    });

    if (!isSuperadmin) {
      return NextResponse.json({
        isSuperadmin: false,
        myKaryaCount,
        unreadNotifications: myNotificationsCount,
      });
    }

    // Superadmin Comprehensive Metrics (PRD 3.10)
    const [
      totalUsers,
      mindCaptainsCount,
      coCaptainsCount,
      baCount,
      totalKaryaPublished,
      allEvents,
      calmingCount,
      promptCount,
      recentKarya,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.admin.count({ where: { title: AdminTitle.MIND_CAPTAIN } }),
      prisma.admin.count({ where: { title: AdminTitle.CO_CAPTAIN } }),
      prisma.admin.count({ where: { title: AdminTitle.BA } }),
      prisma.karya.count(),
      prisma.event.findMany({ select: { eventDate: true } }),
      prisma.contentBank.count({ where: { type: ContentType.CALMING_SENTENCE } }),
      prisma.contentBank.count({ where: { type: ContentType.GUIDED_PROMPT } }),
      prisma.karya.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { owner: { select: { name: true, title: true } } },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, username: true, email: true, createdAt: true },
      }),
    ]);

    const now = new Date();
    const upcomingEventsCount = allEvents.filter((e) => new Date(e.eventDate) >= now).length;
    const pastEventsCount = allEvents.filter((e) => new Date(e.eventDate) < now).length;

    return NextResponse.json({
      isSuperadmin: true,
      myKaryaCount,
      unreadNotifications: myNotificationsCount,
      stats: {
        users: {
          total: totalUsers,
        },
        admins: {
          mindCaptains: mindCaptainsCount,
          coCaptains: coCaptainsCount,
          ba: baCount,
          total: mindCaptainsCount + coCaptainsCount + baCount,
        },
        karya: {
          published: totalKaryaPublished,
        },
        events: {
          upcoming: upcomingEventsCount,
          past: pastEventsCount,
          total: allEvents.length,
        },
        contentBank: {
          calming: calmingCount,
          prompts: promptCount,
          total: calmingCount + promptCount,
        },
      },
      recentKarya,
      recentUsers,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Gagal memuat statistik dashboard." }, { status: 500 });
  }
}
