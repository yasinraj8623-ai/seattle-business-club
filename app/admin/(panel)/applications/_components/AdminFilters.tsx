"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, type SubmitEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";

const BASE = "/admin/applications";

type Props = {
  initial: { q?: string; status?: string; from?: string; to?: string };
};

export default function AdminFilters({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const sp = new URLSearchParams();
    if (initial.status) sp.set("status", initial.status); // keep the active tab
    for (const key of ["q", "from", "to"] as const) {
      const value = String(fd.get(key) ?? "").trim();
      if (value) sp.set(key, value);
    }

    const qs = sp.toString();
    startTransition(() => {
      router.push(qs ? `${BASE}?${qs}` : BASE);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input name="q" defaultValue={initial.q} placeholder="Search name or email" className="w-64 pl-8" />
      </div>

      <label className="flex items-center gap-2 text-xs text-gray-600">
        From
        <Input type="date" name="from" defaultValue={initial.from} className="w-40" />
      </label>
      <label className="flex items-center gap-2 text-xs text-gray-600">
        To
        <Input type="date" name="to" defaultValue={initial.to} className="w-40" />
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? "Applying…" : "Apply"}
      </Button>
      <Link
        href={initial.status ? `${BASE}?status=${initial.status}` : BASE}
        className="px-1 py-2 text-sm text-gray-600 underline"
      >
        Reset
      </Link>
    </form>
  );
}
