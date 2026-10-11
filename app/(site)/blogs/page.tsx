import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { FadeIn, StaggerGroup } from "@/components/motion/reveal";
import BlogCard, { PostMeta } from "./_components/BlogCard";

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, guides, and ideas from the people building Seattle's business community.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    type: "website",
    url: "/blogs",
    siteName: "Seattle Business Club",
    locale: "en_US",
    title: "Blog | Seattle Business Club",
    description: "Stories, guides, and ideas from the people building Seattle's business community.",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Seattle Business Club" }],
  },
};

export default async function BlogsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: rawPage } = await searchParams;
  const requested = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);

  const [{ total }] = await db.select({ total: count() }).from(blogs).where(eq(blogs.published, true));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requested, totalPages);

  const posts = await db
    .select({
      slug: blogs.slug,
      title: blogs.title,
      excerpt: blogs.excerpt,
      coverImage: blogs.coverImage,
      authorName: blogs.authorName,
      publishedAt: blogs.publishedAt,
      readTime: blogs.readTime,
    })
    .from(blogs)
    .where(eq(blogs.published, true))
    .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const featured = page === 1 ? posts[0] : undefined;
  const rest = featured ? posts.slice(1) : posts;
  const pagerClass = "border border-gray-300 px-4 py-2 text-sm";

  return (
    <main>
      <section className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 pt-32 sm:pt-40 md:pt-48">
        <div className="space-y-10 px-4 pb-14 sm:px-6 md:space-y-14 md:pb-25">
          <FadeIn className="space-y-3">
            <h2 className="text-sm font-bold tracking-wide text-[#4A5DF9]">BLOG</h2>
            <h1 className="text-[28px] font-medium leading-[120%] text-[#1E1E1E] sm:text-[32px] md:text-[40px]">
              Stories from the people{" "}
              <span className="inline bg-[linear-gradient(90deg,#93B1EB_0%,#4A5DF9_100%)] bg-clip-text font-bold text-transparent">
                building Seattle
              </span>
            </h1>
          </FadeIn>

          {posts.length === 0 ? (
            <p className=" py-16 text-center text-[#1E1E1E]/60">No posts yet. Check back soon.</p>
          ) : (
            <>
              {featured && (
                <Link
                  href={`/blogs/${featured.slug}`}
                  className="group grid gap-6 md:grid-cols-2 md:gap-10 border-y border-gray-200 py-6"
                >
                  <div className="relative aspect-3/2 overflow-hidden rounded-xs bg-gray-100">
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      fill
                      priority
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-4">
                    <PostMeta post={featured} />
                    <h2 className="font-outfit text-3xl font-medium leading-[120%] tracking-[-0.6px] text-[#1E1E1E] transition-colors group-hover:text-[#4A5DF9] md:text-4xl">
                      {featured.title}
                    </h2>
                    <p className="leading-[150%] text-[#1E1E1E]/60">{featured.excerpt}</p>
                    <p className="text-sm text-[#1E1E1E]/60">By {featured.authorName}</p>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <StaggerGroup className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                  {rest.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </StaggerGroup>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  {page > 1 ? (
                    <Link href={page === 2 ? "/blogs" : `/blogs?page=${page - 1}`} className={pagerClass}>
                      Previous
                    </Link>
                  ) : (
                    <span className={`${pagerClass} opacity-40`}>Previous</span>
                  )}
                  <span className="text-sm text-[#1E1E1E]/60">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages ? (
                    <Link href={`/blogs?page=${page + 1}`} className={pagerClass}>
                      Next
                    </Link>
                  ) : (
                    <span className={`${pagerClass} opacity-40`}>Next</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
