import Link from "next/link";
import { and, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { applications, applicationStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/shadcn/table";
import AdminFilters from "./_components/AdminFilters";
import ApplicationRow from "../../_components/ApplicationRow";
import type { AdminApplication } from "./_components/types";

const BASE = "/admin/applications";
const PAGE_SIZE = 20;
const TZ = "America/Los_Angeles";

const paramsSchema = z.object({
  status: z.enum(applicationStatus.enumValues).optional().catch(undefined),
  from: z.iso.date().optional().catch(undefined),
  to: z.iso.date().optional().catch(undefined),
  q: z.string().trim().max(100).optional().catch(undefined),
  page: z.coerce.number().int().min(1).optional().catch(undefined),
});

const formatDate = (d: Date) => d.toLocaleString("en-US", { timeZone: TZ, dateStyle: "medium", timeStyle: "short" });

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();

  const { status, from, to, q, page: requestedPage } = paramsSchema.parse(await searchParams);

  // Filters shared by the tab counts and the list (everything except status).
  const base: SQL[] = [];
  if (from) base.push(sql`(${applications.createdAt} at time zone ${TZ})::date >= ${from}::date`);
  if (to) base.push(sql`(${applications.createdAt} at time zone ${TZ})::date <= ${to}::date`);
  if (q) {
    const like = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
    base.push(
      or(ilike(applications.firstName, like), ilike(applications.lastName, like), ilike(applications.email, like))!,
    );
  }
  const baseWhere = base.length ? and(...base) : undefined;
  const where = and(baseWhere, status ? eq(applications.status, status) : undefined);

  const countRows = await db
    .select({ status: applications.status, n: count() })
    .from(applications)
    .where(baseWhere)
    .groupBy(applications.status);

  const counts = { pending: 0, approved: 0, rejected: 0 };
  for (const r of countRows) counts[r.status] = r.n;
  const all = counts.pending + counts.approved + counts.rejected;

  const total = status ? counts[status] : all;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage ?? 1, totalPages);

  const rows = await db
    .select()
    .from(applications)
    .where(where)
    .orderBy(desc(applications.createdAt), desc(applications.id))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const items: AdminApplication[] = rows.map((a) => ({
    ...a,
    createdAt: formatDate(a.createdAt),
    reviewedAt: a.reviewedAt ? formatDate(a.reviewedAt) : null,
  }));

  function href(opts: { status?: string; page?: number }) {
    const sp = new URLSearchParams();
    if (opts.status) sp.set("status", opts.status);
    if (from) sp.set("from", from);
    if (to) sp.set("to", to);
    if (q) sp.set("q", q);
    if (opts.page && opts.page > 1) sp.set("page", String(opts.page));
    const qs = sp.toString();
    return qs ? `${BASE}?${qs}` : BASE;
  }

  const tabs = [
    { label: "All", value: undefined, n: all },
    { label: "Pending", value: "pending", n: counts.pending },
    { label: "Approved", value: "approved", n: counts.approved },
    { label: "Rejected", value: "rejected", n: counts.rejected },
  ] as const;

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
  const pagerClass = "rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Applications</h1>
        <p className="text-sm text-gray-500">Review and approve membership requests. Dates use Seattle time.</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-b border-gray-200">
        {tabs.map((t) => {
          const active = status === t.value;
          return (
            <Link
              key={t.label}
              href={href({ status: t.value })}
              className={cn(
                "-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                active ? "border-[#4A5DF9] text-[#4A5DF9]" : "border-transparent text-gray-500 hover:text-gray-900",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  active ? "bg-[#4A5DF9]/10 text-[#4A5DF9]" : "bg-gray-100 text-gray-600",
                )}
              >
                {t.n}
              </span>
            </Link>
          );
        })}
      </nav>

      <AdminFilters key={JSON.stringify({ status, from, to, q })} initial={{ q, status, from, to }} />

      <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
        <Table className="min-w-225">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4">Applicant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>City · Age</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((a) => (
              <ApplicationRow key={a.id} app={a} />
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-sm text-gray-500">
                  No applications match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-gray-500">
          Showing {start}–{end} of {total}
        </p>
        <div className="flex items-center gap-2">
          {page > 1 ? (
            <Link href={href({ status, page: page - 1 })} className={`${pagerClass} hover:bg-gray-100`}>
              Previous
            </Link>
          ) : (
            <span className={`${pagerClass} opacity-40`}>Previous</span>
          )}
          <span className="px-2 text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={href({ status, page: page + 1 })} className={`${pagerClass} hover:bg-gray-100`}>
              Next
            </Link>
          ) : (
            <span className={`${pagerClass} opacity-40`}>Next</span>
          )}
        </div>
      </div>
    </div>
  );
}
