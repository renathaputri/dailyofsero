import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const counselors = await prisma.counselor.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ counselors });
  } catch (error) {
    console.error("Fetch counselors error:", error);
    return NextResponse.json({ error: "Gagal memuat daftar konselor." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN" || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Hanya Superadmin yang dapat menambahkan data konselor." }, { status: 403 });
    }

    const { name, photoUrl, tags } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Nama konselor wajib diisi." }, { status: 400 });
    }

    const counselor = await prisma.counselor.create({
      data: {
        name: name.trim(),
        tags: tags && tags.trim() ? tags.trim() : null,
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      },
    });

    return NextResponse.json({ success: true, counselor });
  } catch (error) {
    console.error("Create counselor error:", error);
    return NextResponse.json({ error: "Gagal menambahkan konselor." }, { status: 500 });
  }
}
