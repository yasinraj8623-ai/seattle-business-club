import "server-only";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  // Newer SDK versions add checksum headers that break R2 presigned PUTs.
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const FOLDERS = ["blog/", "events/"];

// Public URL → object key, or null if the URL isn't one of ours.
function keyFromUrl(url: string) {
  const base = `${process.env.R2_PUBLIC_URL!.replace(/\/$/, "")}/`;
  if (!url.startsWith(base)) return null;
  const key = url.slice(base.length);
  return FOLDERS.some((f) => key.startsWith(f)) ? key : null;
}

// Deletes an uploaded image by its public URL. Ignores /public paths and foreign hosts; never throws.
export async function deleteR2Image(url: string | null | undefined) {
  if (!url) return;
  const key = keyFromUrl(url);
  if (!key) return;

  try {
    await r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }));
  } catch (err) {
    console.error("deleteR2Image failed", key, err);
  }
}
