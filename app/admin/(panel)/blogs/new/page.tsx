import { requireAdmin } from "@/lib/admin-auth";
import BlogForm from "../_components/BlogForm";
import { createBlog } from "../actions";

export default async function NewBlogPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New post</h1>
      <BlogForm action={createBlog} submitLabel="Create post" />
    </div>
  );
}
