import "prosekit/basic/style.css";
import "prosekit/basic/typography.css";

import { cache } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import JsonLd from "@/components/JsonLd";
import { FadeIn, Reveal, StaggerGroup } from "@/components/motion/reveal";
import { formatEventDate } from "@/lib/events";
import BlogCard from "../_components/BlogCard";

const siteUrl = "https://seattlebusinessclub.com";

type Props = { params: Promise<{ slug: string }> };

const getPost = cache(async (slug: string) => {
  const [post] = await db
    .select()
    .from(blogs)
    .where(and(eq(blogs.slug, slug), eq(blogs.published, true)))
    .limit(1);
  return post;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const url = `/blogs/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    authors: [{ name: post.authorName }],
    openGraph: {
      type: "article",
      url,
      siteName: "Seattle Business Club",
      locale: "en_US",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.authorName],
      images: [{ url: post.coverImage, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.coverImage] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const more = await db
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
    .where(and(eq(blogs.published, true), ne(blogs.id, post.id)))
    .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt))
    .limit(3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: new URL(post.coverImage, siteUrl).toString(),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.authorName },
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: `${siteUrl}/blogs/${post.slug}`,
  };

  return (
    <main>
      <JsonLd data={schema} />

      <article className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 pt-32 sm:pt-40 md:pt-48">
        <div className="border-x border-gray-200 px-4 pb-14 sm:px-6 md:pb-25">
          <div className="mx-auto max-w-3xl space-y-8">
            <FadeIn className="space-y-5">
              <p className="text-sm text-[#1E1E1E]/60">
                {formatEventDate(post.publishedAt).label} · {post.readTime} min read
              </p>
              <h1 className="font-outfit text-3xl font-medium leading-[120%] tracking-[-0.6px] text-[#1E1E1E] sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
              <p className="text-lg leading-[150%] text-[#1E1E1E]/60">{post.excerpt}</p>
              <div className="flex items-center gap-3 border-y border-gray-200 py-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#4A5DF9]/10 text-sm font-semibold text-[#4A5DF9]">
                  {post.authorName[0]?.toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-[#1E1E1E]">{post.authorName}</p>
                  <p className="text-[#1E1E1E]/60">Author</p>
                </div>
              </div>
            </FadeIn>

            <div className="relative aspect-video overflow-hidden rounded-xs bg-gray-100">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>

            <div
              className="ProseMirror blog-content [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xs"
              // Content is authored by admins only. Sanitize here if that ever changes.
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10">
          <div className="space-y-8 border-x border-t border-gray-200 px-4 py-14 sm:px-6 md:py-20">
            <Reveal>
              <h2 className="text-2xl font-medium text-[#1E1E1E] md:text-3xl">Keep reading</h2>
            </Reveal>
            <StaggerGroup className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {more.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}
    </main>
  );
}
