"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { applications, applicationStatus, type ApplicationStatus } from "@/db/schema";
import { createSession, destroySession, passwordMatches, requireAdmin } from "@/lib/admin-auth";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function login(formData: FormData) {
  const pw = String(formData.get("password") ?? "");
  if (!passwordMatches(pw)) redirect("/admin/login?error=1");
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function setStatus(id: string, status: ApplicationStatus): Promise<ActionResult> {
  await requireAdmin(); // actions are public endpoints, so check every time

  const parsed = z.object({ id: z.uuid(), status: z.enum(applicationStatus.enumValues) }).safeParse({ id, status });
  if (!parsed.success) return { ok: false, error: "Invalid request." };

  try {
    await db
      .update(applications)
      .set({
        status: parsed.data.status,
        reviewedAt: parsed.data.status === "pending" ? null : new Date(),
      })
      .where(eq(applications.id, parsed.data.id));
  } catch (err) {
    console.error("setStatus failed", err);
    return { ok: false, error: "Could not update status. Try again." };
  }

  revalidatePath("/admin");
  return { ok: true };
}

export async function saveNotes(id: string, notes: string): Promise<ActionResult> {
  await requireAdmin();

  const parsed = z.object({ id: z.uuid(), notes: z.string().max(4000) }).safeParse({ id, notes });
  if (!parsed.success) return { ok: false, error: "Notes are too long (max 4000 characters)." };

  try {
    await db
      .update(applications)
      .set({ notes: parsed.data.notes.trim() || null })
      .where(eq(applications.id, parsed.data.id));
  } catch (err) {
    console.error("saveNotes failed", err);
    return { ok: false, error: "Could not save notes. Try again." };
  }

  revalidatePath("/admin");
  return { ok: true };
}
