import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        title: true,
        photoUrl: true,
        bio: true,
        karya: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Anggota tim tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ member: admin });
  } catch (error) {
    console.error("Fetch team member error:", error);
    return NextResponse.json({ error: "Gagal memuat profil anggota tim." }, { status: 500 });
  }
}
