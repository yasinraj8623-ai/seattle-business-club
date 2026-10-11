import { z } from "zod";
import { EVENT_BADGES } from "@/db/schema";

const time = z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM");

export const eventSchema = z
  .object({
    title: z.string().trim().min(1, "Required").max(120),
    date: z.iso.date("Pick a date"),
    startTime: time,
    endTime: time,
    location: z.string().trim().min(1, "Required").max(120),
    image: z
      .string()
      .trim()
      .min(1, "Required")
      .max(600)
      .refine((v) => v.startsWith("/") || v.startsWith("https://"), "Use a /path or https:// URL"),
    badge: z.enum(EVENT_BADGES),
    href: z
      .string()
      .trim()
      .max(300)
      .refine((v) => v === "" || v.startsWith("/") || v.startsWith("https://"), "Use a /path or https:// URL")
      .transform((v) => v || undefined),
    published: z.boolean(),
  })
  .refine((d) => d.endTime > d.startTime, { path: ["endTime"], message: "Must be after start time" });
