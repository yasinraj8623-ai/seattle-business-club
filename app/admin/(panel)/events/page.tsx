import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { BADGE_LABEL, formatEventDate, formatTime, seattleToday } from "@/lib/events";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import DeleteEventButton from "./_components/DeleteEventButton";

export default async function AdminEventsPage() {
  await requireAdmin();

  const rows = await db.select().from(events).orderBy(desc(events.date), asc(events.startTime));
  const today = seattleToday();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Button render={<Link href="/admin/events/new" />}>New event</Button>
      </div>

      <div className="overflow-x-auto border border-gray-200 bg-white">
        <table className="w-full min-w-200 text-left">
          <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Time · Location</th>
              <th className="px-4 py-3 font-semibold">Badge</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const past = e.date < today;
              return (
                <tr key={e.id} className="border-t border-gray-200 align-top text-sm">
                  <td className="whitespace-nowrap px-4 py-3">{formatEventDate(e.date).label}</td>
                  <td className="px-4 py-3 font-medium">{e.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatTime(e.startTime)} – {formatTime(e.endTime)} · {e.location}
                  </td>
                  <td className="px-4 py-3 text-xs">{BADGE_LABEL[e.badge]}</td>
                  <td className="px-4 py-3">
                    <Badge variant={e.published && !past ? "default" : "secondary"}>
                      {!e.published ? "Draft" : past ? "Past" : "Live"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" render={<Link href={`/admin/events/${e.id}`} />}>
                        Edit
                      </Button>
                      <DeleteEventButton id={e.id} title={e.title} />
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                  No events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
