import type { Uploader } from "prosekit/extensions/file";

type Progress = { loaded: number; total: number };
export type UploadFolder = "blog" | "events";

export function uploadImage(
  file: File,
  onProgress?: (p: Progress) => void,
  folder: UploadFolder = "blog",
): Promise<string> {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/admin/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.({ loaded: e.loaded, total: e.total });
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText) as { url?: string; error?: string };
        if (xhr.status >= 200 && xhr.status < 300 && json.url) resolve(json.url);
        else reject(new Error(json.error ?? `Upload failed (${xhr.status})`));
      } catch {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(body);
  });
}

/** Used by ProseKit for toolbar uploads, drag-drop and paste. */
export const blogUploader: Uploader<string> = ({ file, onProgress }) => uploadImage(file, onProgress);
