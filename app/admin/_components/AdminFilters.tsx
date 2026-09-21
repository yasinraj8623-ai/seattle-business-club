"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, type SubmitEvent } from "react";

type Props = {
  statuses: readonly string[];
  initial: { q?: string; status?: string; from?: string; to?: string };
};

const FILTER_KEYS = ["q", "status", "from", "to"] as const;

const fieldClass = "border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4A5DF9]";

export default function AdminFilters({ statuses, initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const sp = new URLSearchParams();
    for (const key of FILTER_KEYS) {
      const value = String(fd.get(key) ?? "").trim();
      if (value) sp.set(key, value); // skip empty values
    }

    const qs = sp.toString();
    startTransition(() => {
      router.push(qs ? `/admin?${qs}` : "/admin");
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-wrap items-end gap-3">
      <label className="space-y-1 text-xs font-medium text-gray-600">
        Search
        <input
          name="q"
          defaultValue={initial.q}
          placeholder="Name or email"
          className={`${fieldClass} block w-56 font-normal`}
        />
      </label>
      <label className="space-y-1 text-xs font-medium text-gray-600">
        Status
        <select name="status" defaultValue={initial.status ?? ""} className={`${fieldClass} block font-normal`}>
          <option value="">All</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1 text-xs font-medium text-gray-600">
        Applied from
        <input type="date" name="from" defaultValue={initial.from} className={`${fieldClass} block font-normal`} />
      </label>
      <label className="space-y-1 text-xs font-medium text-gray-600">
        Applied to
        <input type="date" name="to" defaultValue={initial.to} className={`${fieldClass} block font-normal`} />
      </label>
      <button
        disabled={pending}
        className="bg-[#4A5DF9] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Applying…" : "Apply"}
      </button>
      <Link href="/admin" className="px-2 py-2 text-sm text-gray-600 underline">
        Reset
      </Link>
    </form>
  );
}
