import Image from "next/image";
import Link from "next/link";
import { StaggerItem } from "@/components/motion/reveal";
import { formatEventDate } from "@/lib/events";

export type BlogCardPost = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  authorName: string;
  publishedAt: string;
  readTime: number;
};

export function PostMeta({ post, className = "" }: { post: BlogCardPost; className?: string }) {
  return (
    <p className={`text-xs leading-[120%] text-[#4A5DF9] ${className}`}>
      {formatEventDate(post.publishedAt).label} · {post.readTime} min read
    </p>
  );
}

export default function BlogCard({ post }: { post: BlogCardPost }) {
  return (
    <StaggerItem className="group flex flex-col">
      <Link href={`/blogs/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-3/2 shrink-0 overflow-hidden rounded-xs bg-gray-100">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 pt-4">
          <PostMeta post={post} />
          <h3 className="font-outfit text-xl font-medium leading-[120%] tracking-[-0.5px] text-[#1E1E1E] transition-colors group-hover:text-[#4A5DF9] md:text-2xl">
            {post.title}
          </h3>
          <p className="line-clamp-3 leading-[150%] text-[#1E1E1E]/60">{post.excerpt}</p>
          <p className="mt-auto pt-2 text-sm text-[#1E1E1E]/60">By {post.authorName}</p>
        </div>
      </Link>
    </StaggerItem>
  );
}
