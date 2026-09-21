import type { applications } from "@/db/schema";

export type AdminApplication = Omit<typeof applications.$inferSelect, "createdAt" | "reviewedAt"> & {
  createdAt: string; // formatted on the server
  reviewedAt: string | null;
};
