import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import BlogForm from "../_components/BlogForm";
import { updateBlog } from "../actions";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const [blog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  if (!blog) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit post</h1>
      <BlogForm action={updateBlog.bind(null, id)} blog={blog} submitLabel="Save changes" />
    </div>
  );
}
