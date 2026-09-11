import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, bio, photoUrl } = await req.json();

    const updated = await prisma.admin.update({
      where: { id: session.id },
      data: {
        name: name ? name.trim() : undefined,
        bio: bio !== undefined ? bio : undefined,
        photoUrl: photoUrl !== undefined ? photoUrl : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profil mini portfoliomu berhasil diperbarui!",
      admin: {
        id: updated.id,
        name: updated.name,
        bio: updated.bio,
        photoUrl: updated.photoUrl,
        title: updated.title,
      },
    });
  } catch (error) {
    console.error("Update portfolio error:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil portfolio." }, { status: 500 });
  }
}
