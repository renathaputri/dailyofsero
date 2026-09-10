import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const team = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        title: true,
        photoUrl: true,
        bio: true,
        _count: {
          select: { karya: true },
        },
      },
      orderBy: [
        { title: "asc" }, // MIND_CAPTAIN, CO_CAPTAIN, BA in enum order
        { name: "asc" },
      ],
    });

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Fetch team error:", error);
    return NextResponse.json({ error: "Gagal memuat daftar tim." }, { status: 500 });
  }
}
