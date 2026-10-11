"use client";

import type { Uploader } from "prosekit/extensions/file";
import { createUploadUrl } from "@/app/admin/upload-actions";

type Progress = { loaded: number; total: number };

export async function uploadImage(file: File, onProgress?: (p: Progress) => void): Promise<string> {
  const res = await createUploadUrl({ contentType: file.type, size: file.size });
  if (!res.ok) throw new Error(res.error);

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", res.uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.({ loaded: e.loaded, total: e.total });
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`));
    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(file);
  });

  return res.publicUrl;
}

/** Used by ProseKit for toolbar uploads, drag-drop and paste. */
export const blogUploader: Uploader<string> = ({ file, onProgress }) => uploadImage(file, onProgress);
