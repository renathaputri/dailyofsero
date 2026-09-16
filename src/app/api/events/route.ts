import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: "asc" },
    });

    const now = new Date();

    const formattedEvents = events.map((e) => {
      const isUpcoming = new Date(e.eventDate) >= now;
      return {
        ...e,
        status: isUpcoming ? "UPCOMING" : "PAST",
      };
    });

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error("Fetch events error:", error);
    return NextResponse.json({ error: "Gagal memuat event." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN" || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Hanya Superadmin yang dapat membuat event." }, { status: 403 });
    }

    const { title, description, eventDate, formLink } = await req.json();
    if (!title || !description || !eventDate || !formLink) {
      return NextResponse.json({ error: "Semua field event wajib diisi." }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        eventDate: new Date(eventDate),
        formLink: formLink.trim(),
      },
    });

    // Notify all admins about new event
    const allAdmins = await prisma.admin.findMany({ select: { id: true } });
    await prisma.notification.createMany({
      data: allAdmins.map((admin) => ({
        adminId: admin.id,
        type: "EVENT_PUBLISHED",
        message: `Event baru telah dipublikasikan: "${newEvent.title}".`,
      })),
    });

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "Gagal membuat event." }, { status: 500 });
  }
}
