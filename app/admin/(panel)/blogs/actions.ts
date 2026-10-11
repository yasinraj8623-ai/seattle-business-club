"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { readTimeMinutes, slugify } from "@/lib/blog";
import { blogSchema, type BlogInput } from "@/lib/blog-validation";

export type BlogState = { ok: boolean; errors?: Record<string, string>; message?: string };
export type ActionResult = { ok: true } | { ok: false; error: string };

function parse(formData: FormData) {
  const parsed = blogSchema.safeParse({
    ...Object.fromEntries(formData),
    published: formData.get("published") === "on",
  });
  if (parsed.success) return { data: parsed.data, errors: null };

  const fieldErrors = z.flattenError(parsed.error).fieldErrors as Record<string, string[]>;
  const errors = Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v[0]]));
  return { data: null, errors };
}

function toValues(d: BlogInput) {
  return {
    slug: d.slug ?? (slugify(d.title) || `post-${Date.now().toString(36)}`),
    title: d.title,
    excerpt: d.excerpt,
    coverImage: d.coverImage,
    authorName: d.authorName,
    publishedAt: d.publishedAt,
    published: d.published,
    contentJson: JSON.parse(d.contentJson) as Record<string, unknown>,
    contentHtml: d.contentHtml,
    readTime: readTimeMinutes(d.contentHtml),
  };
}

function isUniqueViolation(err: unknown) {
  const e = err as { code?: string; cause?: { code?: string } };
  return e?.code === "23505" || e?.cause?.code === "23505";
}

function refresh() {
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  revalidatePath("/blogs/[slug]", "page");
  revalidatePath("/");
}

export async function createBlog(_prev: BlogState, formData: FormData): Promise<BlogState> {
  await requireAdmin();
  const { data, errors } = parse(formData);
  if (!data) return { ok: false, errors };

  try {
    await db.insert(blogs).values(toValues(data));
  } catch (err) {
    if (isUniqueViolation(err)) return { ok: false, errors: { slug: "This slug is already in use" } };
    console.error("createBlog failed", err);
    return { ok: false, message: "Could not create post. Try again." };
  }

  refresh();
  redirect("/admin/blogs");
}

export async function updateBlog(id: string, _prev: BlogState, formData: FormData): Promise<BlogState> {
  await requireAdmin();
  if (!z.uuid().safeParse(id).success) return { ok: false, message: "Invalid post." };

  const { data, errors } = parse(formData);
  if (!data) return { ok: false, errors };

  try {
    await db
      .update(blogs)
      .set({ ...toValues(data), updatedAt: new Date() })
      .where(eq(blogs.id, id));
  } catch (err) {
    if (isUniqueViolation(err)) return { ok: false, errors: { slug: "This slug is already in use" } };
    console.error("updateBlog failed", err);
    return { ok: false, message: "Could not save changes. Try again." };
  }

  refresh();
  redirect("/admin/blogs");
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "Invalid post." };

  try {
    await db.delete(blogs).where(eq(blogs.id, id));
  } catch (err) {
    console.error("deleteBlog failed", err);
    return { ok: false, error: "Could not delete post." };
  }

  refresh();
  return { ok: true };
}
