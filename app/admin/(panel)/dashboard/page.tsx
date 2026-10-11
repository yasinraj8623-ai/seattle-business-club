import Link from "next/link";
import { and, count, desc, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { applications, blogs, events, type ApplicationStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { seattleToday } from "@/lib/events";
import { Badge } from "@/components/ui/shadcn/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card";

const BADGE: Record<ApplicationStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-green-200 bg-green-50 text-green-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
};

const formatDate = (d: Date) =>
  d.toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" });

export default async function DashboardPage() {
  await requireAdmin();

  const [appRows, [{ upcoming }], blogRows, recent] = await Promise.all([
    db.select({ status: applications.status, n: count() }).from(applications).groupBy(applications.status),
    db
      .select({ upcoming: count() })
      .from(events)
      .where(and(eq(events.published, true), gte(events.date, seattleToday()))),
    db.select({ published: blogs.published, n: count() }).from(blogs).groupBy(blogs.published),
    db.select().from(applications).orderBy(desc(applications.createdAt)).limit(6),
  ]);

  const apps = { pending: 0, approved: 0, rejected: 0 };
  for (const r of appRows) apps[r.status] = r.n;
  const totalApps = apps.pending + apps.approved + apps.rejected;

  const publishedPosts = blogRows.find((r) => r.published)?.n ?? 0;
  const draftPosts = blogRows.find((r) => !r.published)?.n ?? 0;

  const stats = [
    {
      label: "Pending applications",
      value: apps.pending,
      note: "Waiting for review",
      href: "/admin/applications?status=pending",
      accent: true,
    },
    {
      label: "Approved members",
      value: apps.approved,
      note: `${totalApps} applications total`,
      href: "/admin/applications?status=approved",
    },
    { label: "Upcoming events", value: upcoming, note: "Published, from today", href: "/admin/events" },
    {
      label: "Published posts",
      value: publishedPosts,
      note: `${draftPosts} draft${draftPosts === 1 ? "" : "s"}`,
      href: "/admin/blogs",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">What needs your attention today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group">
            <Card
              className={`h-full transition-shadow group-hover:shadow-md ${s.accent && s.value > 0 ? "ring-[#4A5DF9]" : ""}`}
            >
              <CardHeader>
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-3xl font-semibold">{s.value}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-500">{s.note}</CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent applications</CardTitle>
          <Link href="/admin/applications" className="text-sm text-[#4A5DF9] underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No applications yet.</p>
          ) : (
            <ul className="divide-y">
              {recent.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {a.firstName} {a.lastName}
                    </p>
                    <p className="truncate text-xs text-gray-500">{a.email}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <span className="hidden text-xs text-gray-500 sm:block">{formatDate(a.createdAt)}</span>
                    <Badge variant="outline" className={`capitalize ${BADGE[a.status]}`}>
                      {a.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
