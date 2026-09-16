import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { KaryaCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as KaryaCategory | null;
    let ownerId = searchParams.get("ownerId");
    const my = searchParams.get("my");

    if (my === "true") {
      const session = await getSession();
      if (session && session.type === "ADMIN") {
        ownerId = session.id;
      }
    }

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (ownerId) whereClause.ownerId = ownerId;

    const karyaList = await prisma.karya.findMany({
      where: whereClause,
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ karya: karyaList });
  } catch (error) {
    console.error("Fetch karya error:", error);
    return NextResponse.json({ error: "Gagal memuat galeri karya." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN") {
      return NextResponse.json({ error: "Hanya Admin / Brand Ambassador yang dapat mengunggah karya." }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, category, linkPost } = body;

    if (!title || !description || !category || !linkPost) {
      return NextResponse.json(
        { error: "Judul, deskripsi, kategori, dan link Instagram wajib diisi ya!" },
        { status: 400 }
      );
    }

    // Auto-publish
    const newKarya = await prisma.karya.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        linkPost: linkPost.trim(),
        ownerId: session.id,
      },
      include: {
        owner: {
          select: { id: true, name: true, username: true, title: true },
        },
      },
    });

    // In-app notification for the author
    await prisma.notification.create({
      data: {
        adminId: session.id,
        type: "KARYA_PUBLISHED",
        message: `Karya barumu "${newKarya.title}" berhasil tayang di Galeri Komunitas!`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Karyamu berhasil ditayangkan!",
      karya: newKarya,
    });
  } catch (error) {
    console.error("Create karya error:", error);
    return NextResponse.json({ error: "Gagal mengunggah karya." }, { status: 500 });
  }
}
