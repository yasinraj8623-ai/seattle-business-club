import Link from "next/link";
import { and, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { applications, applicationStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import AdminFilters from "./_components/AdminFilters";
import ApplicationRow from "./_components/ApplicationRow";
import LogoutButton from "./_components/LogoutButton";
import type { AdminApplication } from "./_components/types";

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

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();

  const { status, from, to, q, page: requestedPage } = paramsSchema.parse(await searchParams);

  const filters: SQL[] = [];
  if (status) filters.push(eq(applications.status, status));
  if (from) filters.push(sql`(${applications.createdAt} at time zone ${TZ})::date >= ${from}::date`);
  if (to) filters.push(sql`(${applications.createdAt} at time zone ${TZ})::date <= ${to}::date`);
  if (q) {
    const like = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
    filters.push(
      or(ilike(applications.firstName, like), ilike(applications.lastName, like), ilike(applications.email, like))!,
    );
  }
  const where = filters.length ? and(...filters) : undefined;

  const [{ total }] = await db.select({ total: count() }).from(applications).where(where);
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

  function pageHref(p: number) {
    const sp = new URLSearchParams();
    if (status) sp.set("status", status);
    if (from) sp.set("from", from);
    if (to) sp.set("to", to);
    if (q) sp.set("q", q);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/admin?${qs}` : "/admin";
  }

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
  const pagerClass = "border border-gray-300 bg-white px-3 py-1.5";

  return (
    <main className="mx-auto max-w-300 px-5 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Applications</h1>
        <LogoutButton />
      </div>

      <AdminFilters
        key={JSON.stringify({ status, from, to, q })}
        statuses={applicationStatus.enumValues}
        initial={{ q, status, from, to }}
      />
      <p className="mt-2 text-xs text-gray-500">Dates use Seattle time.</p>

      <div className="mt-6 overflow-x-auto border border-gray-200 bg-white">
        <table className="w-full min-w-225 text-left">
          <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Applied</th>
              <th className="px-4 py-3 font-semibold">Applicant</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">City · Age</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((a) => (
              <ApplicationRow key={a.id} app={a} />
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                  No applications match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-gray-500">
          Showing {start}–{end} of {total}
        </p>
        <div className="flex items-center gap-2">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className={`${pagerClass} hover:bg-gray-100`}>
              Previous
            </Link>
          ) : (
            <span className={`${pagerClass} opacity-40`}>Previous</span>
          )}
          <span className="px-2 text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={pageHref(page + 1)} className={`${pagerClass} hover:bg-gray-100`}>
              Next
            </Link>
          ) : (
            <span className={`${pagerClass} opacity-40`}>Next</span>
          )}
        </div>
      </div>
    </main>
  );
}
