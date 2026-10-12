import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { isAdmin } from "@/lib/admin-auth";
import { r2 } from "@/lib/r2";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
const FOLDERS: readonly string[] = ["blog", "events"];
const MAX_BYTES = 4 * 1024 * 1024; // Vercel's request body limit is ~4.5 MB

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "blog");

  if (!(file instanceof File)) return NextResponse.json({ error: "No file." }, { status: 400 });
  if (!FOLDERS.includes(folder)) return NextResponse.json({ error: "Invalid folder." }, { status: 400 });

  const ext = EXT[file.type];
  if (!ext) return NextResponse.json({ error: "Only JPEG, PNG, WebP, GIF or AVIF images." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be under 4 MB." }, { status: 400 });

  const key = `${folder}/${new Date().getUTCFullYear()}/${randomUUID()}.${ext}`;

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        Body: new Uint8Array(await file.arrayBuffer()),
        ContentType: file.type,
      }),
    );
  } catch (err) {
    console.error("upload failed", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }

  return NextResponse.json({ url: `${process.env.R2_PUBLIC_URL!.replace(/\/$/, "")}/${key}` });
}
