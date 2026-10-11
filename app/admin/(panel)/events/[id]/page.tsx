import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { events } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import EventForm from "../_components/EventForm";
import { updateEvent } from "../actions";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!event) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit event</h1>
      <EventForm action={updateEvent.bind(null, id)} event={event} submitLabel="Save changes" />
    </div>
  );
}
