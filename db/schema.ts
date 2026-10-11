import { pgEnum, pgTable, text, integer, timestamp, uuid, date, boolean, time, jsonb } from "drizzle-orm/pg-core";

export const applicationStatus = pgEnum("application_status", ["pending", "approved", "rejected"]);

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  age: integer("age").notNull(),
  city: text("city"),
  profession: text("profession"),
  linkedin: text("linkedin").notNull(),
  instagram: text("instagram"),
  website: text("website"),
  source: text("source").notNull(),
  passion: text("passion").notNull(),
  oneMessage: text("one_message").notNull(),
  whyJoin: text("why_join").notNull(),
  introduction: text("introduction"),
  referralCode: text("referral_code"),

  status: applicationStatus("status").default("pending").notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  notes: text("notes"),
});

export type ApplicationStatus = (typeof applicationStatus.enumValues)[number];

export const EVENT_BADGES = ["limited_seats", "members_free", "open"] as const;
export type EventBadge = (typeof EVENT_BADGES)[number];

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),

  title: text("title").notNull(),
  date: date("date", { mode: "string" }).notNull(), // YYYY-MM-DD
  startTime: time("start_time").notNull(), // HH:MM:SS
  endTime: time("end_time").notNull(),
  location: text("location").notNull(),
  image: text("image").notNull(),
  badge: text("badge").$type<EventBadge>().notNull().default("limited_seats"),
  href: text("href"),
  published: boolean("published").default(true).notNull(),
});

export type EventRow = typeof events.$inferSelect;

export const blogs = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),

  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  coverImage: text("cover_image").notNull(),
  authorName: text("author_name").notNull(),
  publishedAt: date("published_at", { mode: "string" }).notNull(),
  readTime: integer("read_time").notNull(), // minutes, derived from content on save
  published: boolean("published").default(false).notNull(),

  contentJson: jsonb("content_json").$type<Record<string, unknown>>().notNull(), // editor source of truth
  contentHtml: text("content_html").notNull(), // for rendering on the public page later
});

export type BlogRow = typeof blogs.$inferSelect;
