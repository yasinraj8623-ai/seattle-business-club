import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { formatEventDate } from "@/lib/events";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import DeleteBlogButton from "./_components/DeleteBlogButton";

export default async function AdminBlogsPage() {
  await requireAdmin();

  const rows = await db
    .select({
      id: blogs.id,
      slug: blogs.slug,
      title: blogs.title,
      coverImage: blogs.coverImage,
      authorName: blogs.authorName,
      publishedAt: blogs.publishedAt,
      readTime: blogs.readTime,
      published: blogs.published,
    })
    .from(blogs)
    .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Blogs</h1>
        <Button render={<Link href="/admin/blogs/new" />}>New post</Button>
      </div>

      <div className="overflow-x-auto border border-gray-200 bg-white">
        <table className="w-full min-w-225 text-left">
          <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Post</th>
              <th className="px-4 py-3 font-semibold">Author</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Read</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-t border-gray-200 align-top text-sm">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.coverImage} alt="" className="h-12 w-18 shrink-0 object-cover" />
                    <div>
                      <p className="font-medium">{b.title}</p>
                      <p className="text-xs text-gray-500">/{b.slug}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">{b.authorName}</td>
                <td className="whitespace-nowrap px-4 py-3">{formatEventDate(b.publishedAt).label}</td>
                <td className="whitespace-nowrap px-4 py-3">{b.readTime} min</td>
                <td className="px-4 py-3">
                  <Badge variant={b.published ? "default" : "secondary"}>{b.published ? "Published" : "Draft"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" render={<Link href={`/admin/blogs/${b.id}`} />}>
                      Edit
                    </Button>
                    <DeleteBlogButton id={b.id} title={b.title} />
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
