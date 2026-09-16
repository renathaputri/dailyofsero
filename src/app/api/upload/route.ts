import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.type !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (token) {
      // Upload using Vercel Blob
      const blob = await put(`avatars/${Date.now()}-${file.name}`, file, {
        access: "public",
        token,
      });

      return NextResponse.json({ url: blob.url });
    } else {
      // Local fallback: convert to base64 data URL for instant local testing without token
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = file.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return NextResponse.json({ url: dataUrl });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal mengunggah file." }, { status: 500 });
  }
}
