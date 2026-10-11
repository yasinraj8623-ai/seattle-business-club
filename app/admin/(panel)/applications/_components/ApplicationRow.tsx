"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { ApplicationStatus } from "@/db/schema";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { TableCell, TableRow } from "@/components/ui/shadcn/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/shadcn/sheet";
import { AdminApplication } from "./types";
import { saveNotes, setStatus } from "@/app/admin/actions";

const BADGE: Record<ApplicationStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-green-200 bg-green-50 text-green-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
};

const ACTIONS: Record<
  ApplicationStatus,
  { label: string; busy: string; variant: "default" | "outline"; className?: string }
> = {
  approved: {
    label: "Approve",
    busy: "Approving…",
    variant: "default",
    className: "bg-green-600 text-white hover:bg-green-700",
  },
  rejected: {
    label: "Reject",
    busy: "Rejecting…",
    variant: "outline",
    className: "border-red-300 text-red-700 hover:bg-red-50",
  },
  pending: { label: "Reset to pending", busy: "Resetting…", variant: "outline" },
};

const toHref = (v: string) => (/^https?:\/\//i.test(v) ? v : `https://${v}`);

function StatusActions({ app }: { app: AdminApplication }) {
  const [pending, start] = useTransition();
  const [target, setTarget] = useState<ApplicationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  function change(next: ApplicationStatus) {
    setError(null);
    setTarget(next);
    start(async () => {
      const res = await setStatus(app.id, next);
      if (!res.ok) setError(res.error);
    });
  }

  const next = (Object.keys(ACTIONS) as ApplicationStatus[]).filter((s) => s !== app.status);

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {next.map((s) => (
          <Button
            key={s}
            type="button"
            size="sm"
            variant={ACTIONS[s].variant}
            className={ACTIONS[s].className}
            disabled={pending}
            onClick={() => change(s)}
          >
            {pending && target === s ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                {ACTIONS[s].busy}
              </>
            ) : (
              ACTIONS[s].label
            )}
          </Button>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap wrap-break-word text-sm">{children}</dd>
    </div>
  );
}

function LinkValue({ value }: { value: string | null }) {
  if (!value) return null;
  return (
    <a href={toHref(value)} target="_blank" rel="noopener noreferrer" className="text-[#4A5DF9] underline">
      {value}
    </a>
  );
}

function Notes({ app }: { app: AdminApplication }) {
  const [notes, setNotes] = useState(app.notes ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const dirty = notes !== (app.notes ?? "");

  function submit() {
    setError(null);
    setSaved(false);
    start(async () => {
      const res = await saveNotes(app.id, notes);
      if (res.ok) setSaved(true);
      else setError(res.error);
    });
  }

  return (
    <div className="space-y-2">
      <label htmlFor={`notes-${app.id}`} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Internal notes
      </label>
      <Textarea
        id={`notes-${app.id}`}
        rows={4}
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
      />
      <div className="flex items-center gap-3">
        <Button type="button" size="sm" disabled={pending || !dirty} onClick={submit}>
          {pending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Saving…
            </>
          ) : (
            "Save notes"
          )}
        </Button>
        {saved && !dirty && <span className="text-xs text-green-700">Saved</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </div>
  );
}

export default function ApplicationRow({ app }: { app: AdminApplication }) {
  const [open, setOpen] = useState(false);
  const initials = `${app.firstName[0] ?? ""}${app.lastName[0] ?? ""}`.toUpperCase();

  return (
    <>
      <TableRow className="align-middle">
        <TableCell className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#4A5DF9]/10 text-xs font-semibold text-[#4A5DF9]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium">
                {app.firstName} {app.lastName}
              </p>
              {app.profession && <p className="truncate text-xs text-gray-500">{app.profession}</p>}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-sm">
          <p>{app.email}</p>
          <p className="text-xs text-gray-500">{app.phone}</p>
        </TableCell>
        <TableCell className="whitespace-nowrap text-sm text-gray-600">
          {app.city ?? "—"} · {app.age}
        </TableCell>
        <TableCell className="whitespace-nowrap text-sm text-gray-600">{app.createdAt}</TableCell>
        <TableCell>
          <Badge variant="outline" className={`capitalize ${BADGE[app.status]}`}>
            {app.status}
          </Badge>
        </TableCell>
        <TableCell className="pr-4">
          <div className="flex items-center justify-end gap-2">
            {app.status === "pending" && <StatusActions app={app} />}
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
              Review
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-xl">
          <SheetHeader className="border-b">
            <div className="flex items-center gap-2">
              <SheetTitle>
                {app.firstName} {app.lastName}
              </SheetTitle>
              <Badge variant="outline" className={`capitalize ${BADGE[app.status]}`}>
                {app.status}
              </Badge>
            </div>
            <SheetDescription>
              Applied {app.createdAt}
              {app.reviewedAt ? ` · Reviewed ${app.reviewedAt}` : ""}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8 p-4">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold">Contact</h3>
              <dl className="grid gap-4 sm:grid-cols-2">
                <Field label="Email">{app.email}</Field>
                <Field label="Phone">{app.phone}</Field>
                <Field label="City">{app.city}</Field>
                <Field label="Age">{String(app.age)}</Field>
                <Field label="Profession">{app.profession}</Field>
                <Field label="Found us via">{app.source}</Field>
                <Field label="Referral code">{app.referralCode}</Field>
              </dl>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold">Links</h3>
              <dl className="grid gap-4 sm:grid-cols-2">
                <Field label="LinkedIn">
                  <LinkValue value={app.linkedin} />
                </Field>
                <Field label="Instagram">
                  <LinkValue value={app.instagram} />
                </Field>
                <Field label="Website">
                  <LinkValue value={app.website} />
                </Field>
              </dl>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold">Their answers</h3>
              <dl className="space-y-4">
                <Field label="Passionate about">{app.passion}</Field>
                <Field label="One message for the world">{app.oneMessage}</Field>
                <Field label="Why join">{app.whyJoin}</Field>
                <Field label="Wants an intro to">{app.introduction}</Field>
              </dl>
            </section>

            <Notes app={app} />
          </div>

          <div className="sticky bottom-0 mt-auto flex justify-end border-t bg-white p-4">
            <StatusActions app={app} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
