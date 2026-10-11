"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { events } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { eventSchema } from "@/lib/event-validation";

export type EventState = { ok: boolean; errors?: Record<string, string>; message?: string };
export type ActionResult = { ok: true } | { ok: false; error: string };

function parse(formData: FormData) {
  const parsed = eventSchema.safeParse({
    ...Object.fromEntries(formData),
    published: formData.get("published") === "on",
  });

  if (parsed.success) return { data: parsed.data, errors: null };

  const fieldErrors = z.flattenError(parsed.error).fieldErrors as Record<string, string[]>;
  const errors = Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v[0]]));
  return { data: null, errors };
}

function refresh() {
  revalidatePath("/admin/events");
  revalidatePath("/"); // landing page Upcoming Events
}

export async function createEvent(_prev: EventState, formData: FormData): Promise<EventState> {
  await requireAdmin();
  const { data, errors } = parse(formData);
  if (!data) return { ok: false, errors };

  try {
    await db.insert(events).values({ ...data, href: data.href ?? null });
  } catch (err) {
    console.error("createEvent failed", err);
    return { ok: false, message: "Could not create event. Try again." };
  }

  refresh();
  redirect("/admin/events");
}

export async function updateEvent(id: string, _prev: EventState, formData: FormData): Promise<EventState> {
  await requireAdmin();
  if (!z.uuid().safeParse(id).success) return { ok: false, message: "Invalid event." };

  const { data, errors } = parse(formData);
  if (!data) return { ok: false, errors };

  try {
    await db
      .update(events)
      .set({ ...data, href: data.href ?? null, updatedAt: new Date() }) // null clears the link
      .where(eq(events.id, id));
  } catch (err) {
    console.error("updateEvent failed", err);
    return { ok: false, message: "Could not save changes. Try again." };
  }

  refresh();
  redirect("/admin/events");
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "Invalid event." };

  try {
    await db.delete(events).where(eq(events.id, id));
  } catch (err) {
    console.error("deleteEvent failed", err);
    return { ok: false, error: "Could not delete event." };
  }

  refresh();
  return { ok: true };
}
