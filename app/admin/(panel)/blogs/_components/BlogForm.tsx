"use client";

import React, { startTransition, useActionState, useCallback, useRef, useState } from "react";
import Link from "next/link";
import type { NodeJSON } from "prosekit/core";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import type { BlogRow } from "@/db/schema";
import { seattleToday } from "@/lib/events";
import type { BlogState } from "../actions";
import BlogEditor, { type BlogEditorInstance } from "./BlogEditor";
import CoverImageField from "./CoverImageField";
import FormField from "./FormField";

type Props = {
  action: (prev: BlogState, formData: FormData) => Promise<BlogState>;
  blog?: BlogRow;
  submitLabel: string;
};

export default function BlogForm({ action, blog, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<BlogState, FormData>(action, { ok: false });
  const [clientError, setClientError] = useState<string | null>(null);
  const editorRef = useRef<BlogEditorInstance | null>(null);
  const err = state.errors ?? {};
  const [uploading, setUploading] = useState(false);

  const handleReady = useCallback((editor: BlogEditorInstance) => {
    editorRef.current = editor;
  }, []);

  // Submit manually so React doesn't reset the fields when validation fails.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const editor = editorRef.current;
    if (!editor) return;

    const raw = editor.getDocHTML();
    const html = raw.startsWith("<div>") && raw.endsWith("</div>") ? raw.slice(5, -6) : raw;

    if (html.includes('src="blob:')) {
      setClientError("An image is still uploading. Wait for it to finish, then save.");
      return;
    }
    setClientError(null);

    const fd = new FormData(e.currentTarget);
    fd.set("contentJson", JSON.stringify(editor.getDocJSON()));
    fd.set("contentHtml", html);
    startTransition(() => formAction(fd));
  }

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-6 border bg-white p-6">
      <FormField label="Title" name="title" error={err.title}>
        <Input id="title" name="title" defaultValue={blog?.title} />
      </FormField>

      <FormField
        label="Slug (optional)"
        name="slug"
        error={err.slug}
        hint="Leave empty to generate from the title. Changing it later changes the post URL."
      >
        <Input id="slug" name="slug" defaultValue={blog?.slug} placeholder="my-first-post" />
      </FormField>

      <FormField label="Excerpt" name="excerpt" error={err.excerpt}>
        <Textarea id="excerpt" name="excerpt" rows={3} defaultValue={blog?.excerpt} />
      </FormField>

      <FormField label="Cover image" name="coverImage" error={err.coverImage}>
        <CoverImageField defaultValue={blog?.coverImage} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Author" name="authorName" error={err.authorName}>
          <Input id="authorName" name="authorName" defaultValue={blog?.authorName} />
        </FormField>

        <FormField label="Date" name="publishedAt" error={err.publishedAt}>
          <Input id="publishedAt" name="publishedAt" type="date" defaultValue={blog?.publishedAt ?? seattleToday()} />
        </FormField>
      </div>

      <FormField label="Content" name="content" error={err.content}>
        <BlogEditor
          initialContent={blog?.contentJson as NodeJSON | undefined}
          onReady={handleReady}
          onBusyChange={setUploading}
        />
      </FormField>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={blog?.published ?? false} className="size-4" />
        Published
      </label>

      {(clientError || state.message) && (
        <p role="alert" className="text-sm text-red-600">
          {clientError ?? state.message}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" data-save disabled={pending || uploading}>
          {uploading ? "Uploading images…" : pending ? "Saving…" : submitLabel}
        </Button>
        <Button variant="secondary" render={<Link href="/admin/blogs">Cancel</Link>}></Button>
      </div>
    </form>
  );
}
