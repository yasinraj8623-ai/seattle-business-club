"use client";

import React, { startTransition, useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { EVENT_BADGES, type EventRow } from "@/db/schema";
import { BADGE_LABEL } from "@/lib/events";
import { EventState } from "../actions";
import CoverImageField from "@/app/admin/_components/CoverImageField";

type Props = {
  action: (prev: EventState, formData: FormData) => Promise<EventState>;
  event?: EventRow;
  submitLabel: string;
};

const selectClass =
  "h-8 w-full border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring";

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function EventForm({ action, event, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<EventState, FormData>(action, { ok: false });
  const err = state.errors ?? {};

  // Submit manually so React doesn't reset the fields when validation fails.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5 border bg-white p-6">
      <Field label="Title" name="title" error={err.title}>
        <Input id="title" name="title" defaultValue={event?.title} required />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Date" name="date" error={err.date}>
          <Input id="date" name="date" type="date" defaultValue={event?.date} required />
        </Field>
        <Field label="Start" name="startTime" error={err.startTime}>
          <Input id="startTime" name="startTime" type="time" defaultValue={event?.startTime.slice(0, 5)} required />
        </Field>
        <Field label="End" name="endTime" error={err.endTime}>
          <Input id="endTime" name="endTime" type="time" defaultValue={event?.endTime.slice(0, 5)} required />
        </Field>
      </div>

      <Field label="Location" name="location" error={err.location}>
        <Input id="location" name="location" defaultValue={event?.location} required />
      </Field>

      <div className="space-y-1.5">
        <p className="text-sm font-medium">Event image</p>
        <CoverImageField name="image" folder="events" defaultValue={event?.image} error={err.image} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Badge" name="badge" error={err.badge}>
          <select id="badge" name="badge" defaultValue={event?.badge ?? "limited_seats"} className={selectClass}>
            {EVENT_BADGES.map((b) => (
              <option key={b} value={b}>
                {BADGE_LABEL[b]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Link (optional, default Eventbrite)" name="href" error={err.href}>
          <Input id="href" name="href" placeholder="https://..." defaultValue={event?.href ?? ""} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={event?.published ?? true} className="size-4" />
        Published (visible on the landing page)
      </label>

      {state.message && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        <Link href="/admin/events" className="text-sm text-gray-600 underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
