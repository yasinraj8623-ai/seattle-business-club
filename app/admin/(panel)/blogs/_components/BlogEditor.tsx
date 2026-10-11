"use client";

import "prosekit/basic/style.css";
import "prosekit/basic/typography.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import { defineBasicExtension } from "prosekit/basic";
import { createEditor, defineDOMEventHandler, union, type Editor, type NodeJSON } from "prosekit/core";
import { defineHorizontalRule } from "prosekit/extensions/horizontal-rule";
import { definePlaceholder } from "prosekit/extensions/placeholder";
import { TextSelection } from "prosekit/pm/state";
import { ProseKit, useExtension } from "prosekit/react";

// Adjust this prefix if the CLI put them elsewhere.
import { Toolbar } from "@/components/editor/ui/toolbar";
import { InlineMenu } from "@/components/editor/ui/inline-menu";
import { SlashMenu } from "@/components/editor/ui/slash-menu";
import { BlockHandle } from "@/components/editor/ui/block-handle";
import { TableHandle } from "@/components/editor/ui/table-handle";
import { DropIndicator } from "@/components/editor/ui/drop-indicator";
import { defineImageView } from "@/components/editor/ui/image-view";

import { uploadImage } from "@/lib/blog-uploader";

const imageFiles = (list?: FileList | null) => Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));

function defineExtension() {
  return union(
    defineBasicExtension(),
    definePlaceholder({ placeholder: "Press / for commands..." }),
    defineHorizontalRule(),
    defineImageView(),
  );
}

function defineFileHandlers(onImageFiles: (files: File[]) => void) {
  return union(
    defineDOMEventHandler("paste", (_view, event) => {
      const files = imageFiles(event.clipboardData?.files);
      if (files.length === 0) return false;
      event.preventDefault();
      onImageFiles(files);
      return true;
    }),
    defineDOMEventHandler("drop", (view, event) => {
      const files = imageFiles(event.dataTransfer?.files);
      if (files.length === 0) return false;
      event.preventDefault();

      // Put the cursor where the file was dropped; the image is inserted there when the upload finishes.
      const at = view.posAtCoords({ left: event.clientX, top: event.clientY });
      if (at) view.dispatch(view.state.tr.setSelection(TextSelection.near(view.state.doc.resolve(at.pos))));

      onImageFiles(files);
      return true;
    }),
  );
}

export type BlogEditorInstance = Editor<ReturnType<typeof defineExtension>>;

type UploadItem = { id: string; name: string; progress: number; error: string | null };

type Props = {
  initialContent?: NodeJSON;
  onReady: (editor: BlogEditorInstance) => void;
  onBusyChange?: (busy: boolean) => void;
};

export default function BlogEditor({ initialContent, onReady, onBusyChange }: Props) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const editor = useMemo(
    () =>
      createEditor({
        extension: defineExtension(),
        defaultContent: initialContent,
      }),
    [initialContent],
  );

  const mountEditor = useCallback((el: HTMLDivElement | null) => editor.mount(el), [editor]);

  const patch = useCallback(
    (id: string, next: Partial<UploadItem>) =>
      setUploads((list) => list.map((u) => (u.id === id ? { ...u, ...next } : u))),
    [],
  );
  const remove = useCallback((id: string) => setUploads((list) => list.filter((u) => u.id !== id)), []);

  const handleFiles = useCallback(
    (files: File[]) => {
      for (const file of files) {
        const id = crypto.randomUUID();
        setUploads((list) => [...list, { id, name: file.name, progress: 0, error: null }]);

        uploadImage(file, ({ loaded, total }) => patch(id, { progress: total ? loaded / total : 0 }))
          .then((url) => {
            editor.commands.insertImage({ src: url }); // only now does the image enter the document
            remove(id);
          })
          .catch((err) => patch(id, { error: err instanceof Error ? err.message : "Upload failed" }));
      }
    },
    [editor, patch, remove],
  );

  const fileHandlers = useMemo(() => defineFileHandlers(handleFiles), [handleFiles]);
  useExtension(fileHandlers, { editor });

  useEffect(() => {
    onReady(editor);
  }, [editor, onReady]);

  const busy = uploads.some((u) => !u.error);
  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  return (
    <ProseKit editor={editor}>
      <div
        onSubmit={(e) => e.stopPropagation()}
        className="box-border flex h-150 w-full flex-col overflow-hidden rounded-md border border-solid border-gray-200 bg-[canvas] text-black shadow-sm"
      >
        <Toolbar onUploadFile={(file) => handleFiles([file])} />

        {uploads.length > 0 && (
          <div className="space-y-2 border-b border-gray-200 bg-gray-50 px-3 py-2">
            {uploads.map((u) => (
              <div key={u.id} className="space-y-1">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="truncate">{u.name}</span>
                  {u.error ? (
                    <button type="button" onClick={() => remove(u.id)} className="text-red-600 underline">
                      Dismiss
                    </button>
                  ) : (
                    <span className="tabular-nums text-gray-600">{Math.round(u.progress * 100)}%</span>
                  )}
                </div>
                {u.error ? (
                  <p className="text-xs text-red-600">{u.error}</p>
                ) : (
                  <div className="h-1.5 w-full overflow-hidden rounded bg-gray-200">
                    <div className="h-full bg-[#4A5DF9] transition-[width]" style={{ width: `${u.progress * 100}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="relative box-border w-full flex-1 overflow-y-auto">
          <div
            ref={mountEditor}
            className="ProseMirror box-border min-h-full px-[max(2rem,calc(50%-20rem))] py-8 outline-hidden outline-0"
          />
          <InlineMenu />
          <SlashMenu />
          <BlockHandle />
          <TableHandle />
          <DropIndicator />
        </div>
      </div>
    </ProseKit>
  );
}
