"use client";

import { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { uploadImage } from "@/lib/blog-uploader";

export default function CoverImageField({ defaultValue = "", error }: { defaultValue?: string; error?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError(null);
    setProgress(0);
    try {
      setUrl(await uploadImage(file, ({ loaded, total }) => setProgress(total ? loaded / total : 0)));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setProgress(null);
    }
  }

  const uploading = progress !== null;

  return (
    <div className="space-y-2">
      <input type="hidden" name="coverImage" value={url} />

      {url && (
        <div className="aspect-3/2 w-full max-w-sm overflow-hidden border bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Cover preview" className="size-full object-cover" />
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" disabled={uploading} render={<label />}>
          {uploading ? `Uploading ${Math.round((progress ?? 0) * 100)}%` : url ? "Replace image" : "Upload image"}
          <input type="file" accept="image/*" onChange={onPick} className="sr-only" />
        </Button>
        {url && !uploading && (
          <button type="button" onClick={() => setUrl("")} className="text-sm text-gray-600 underline">
            Remove
          </button>
        )}
      </div>

      {(uploadError || error) && <p className="text-xs text-red-600">{uploadError ?? error}</p>}
    </div>
  );
}
