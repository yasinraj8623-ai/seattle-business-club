import { z } from "zod";
import { htmlToText } from "@/lib/blog";

export const blogSchema = z
  .object({
    title: z.string().trim().min(1, "Required").max(150),
    slug: z
      .string()
      .trim()
      .max(80)
      .refine((v) => v === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v), "Lowercase letters, numbers and hyphens only")
      .transform((v) => v || undefined),
    excerpt: z.string().trim().min(1, "Required").max(300),
    coverImage: z
      .string()
      .trim()
      .min(1, "Required")
      .max(300)
      .refine((v) => v.startsWith("/") || v.startsWith("https://"), "Use a /path or https:// URL"),
    authorName: z.string().trim().min(1, "Required").max(80),
    publishedAt: z.iso.date("Pick a date"),
    published: z.boolean(),
    contentJson: z
      .string()
      .max(2_000_000)
      .refine((s) => {
        try {
          return JSON.parse(s)?.type === "doc";
        } catch {
          return false;
        }
      }, "Invalid content")
      .refine((s) => !s.includes('"blob:'), "An image is still uploading"),
    contentHtml: z.string().max(1_000_000),
  })
  .refine((d) => htmlToText(d.contentHtml) !== "" || d.contentHtml.includes("<img"), {
    path: ["contentHtml"],
    message: "Write some content",
  });

export type BlogInput = z.infer<typeof blogSchema>;
