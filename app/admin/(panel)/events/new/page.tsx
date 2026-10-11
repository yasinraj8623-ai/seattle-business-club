import { requireAdmin } from "@/lib/admin-auth";
import EventForm from "../_components/EventForm";
import { createEvent } from "../actions";

export default async function NewEventPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New event</h1>
      <EventForm action={createEvent} submitLabel="Create event" />
    </div>
  );
}
