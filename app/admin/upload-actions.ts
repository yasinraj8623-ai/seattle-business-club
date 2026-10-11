"use server";

import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { requireAdmin } from "@/lib/admin-auth";

export type UploadResult = { ok: true; uploadUrl: string; publicUrl: string } | { ok: false; error: string };

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
const MAX_BYTES = 8 * 1024 * 1024;

export async function createUploadUrl(input: { contentType: string; size: number }): Promise<UploadResult> {
  await requireAdmin();

  const ext = EXT[input.contentType];
  if (!ext) return { ok: false, error: "Only JPEG, PNG, WebP, GIF or AVIF images." };
  if (!Number.isFinite(input.size) || input.size <= 0 || input.size > MAX_BYTES) {
    return { ok: false, error: "Image must be under 8 MB." };
  }

  const key = `blog/${new Date().getUTCFullYear()}/${randomUUID()}.${ext}`;

  try {
    const uploadUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        ContentType: input.contentType,
        ContentLength: input.size,
      }),
      { expiresIn: 300 },
    );
    return { ok: true, uploadUrl, publicUrl: `${process.env.R2_PUBLIC_URL!.replace(/\/$/, "")}/${key}` };
  } catch (err) {
    console.error("createUploadUrl failed", err);
    return { ok: false, error: "Could not start upload." };
  }
}
