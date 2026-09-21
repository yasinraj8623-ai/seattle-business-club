import { pgEnum, pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";

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
