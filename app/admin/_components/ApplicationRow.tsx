"use client";

import { useState, useTransition } from "react";
import type { ApplicationStatus } from "@/db/schema";
import { saveNotes, setStatus } from "../actions";
import type { AdminApplication } from "./types";

const BADGE: Record<ApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const ACTIONS: Record<ApplicationStatus, { label: string; busy: string; className: string }> = {
  approved: { label: "Approve", busy: "Approving…", className: "bg-green-600 text-white hover:bg-green-700" },
  rejected: { label: "Reject", busy: "Rejecting…", className: "bg-red-600 text-white hover:bg-red-700" },
  pending: { label: "Reset", busy: "Resetting…", className: "border border-gray-300 bg-white hover:bg-gray-100" },
};

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="mr-1.5 inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent align-[-2px]"
    />
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-wrap wrap-break-word">{value}</dd>
    </div>
  );
}

export default function ApplicationRow({ app }: { app: AdminApplication }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(app.notes ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus | null>(null);

  const [statusPending, startStatus] = useTransition();
  const [notesPending, startNotes] = useTransition();

  function changeStatus(next: ApplicationStatus) {
    setError(null);
    setTargetStatus(next);
    startStatus(async () => {
      const res = await setStatus(app.id, next);
      if (!res.ok) setError(res.error);
    });
  }

  function submitNotes() {
    setError(null);
    setSaved(false);
    startNotes(async () => {
      const res = await saveNotes(app.id, notes);
      if (res.ok) setSaved(true);
      else setError(res.error);
    });
  }

  const dirty = notes !== (app.notes ?? "");
  const nextStatuses = (Object.keys(ACTIONS) as ApplicationStatus[]).filter((s) => s !== app.status);

  return (
    <>
      <tr className="border-t border-gray-200 align-top">
        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{app.createdAt}</td>
        <td className="px-4 py-3">
          <p className="font-medium">
            {app.firstName} {app.lastName}
          </p>
          {app.profession && <p className="text-xs text-gray-500">{app.profession}</p>}
        </td>
        <td className="px-4 py-3 text-sm">
          <p>{app.email}</p>
          <p className="text-gray-500">{app.phone}</p>
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
          {app.city ?? "—"} · {app.age}
        </td>
        <td className="px-4 py-3">
          <span className={`inline-block px-2 py-0.5 text-xs font-medium capitalize ${BADGE[app.status]}`}>
            {app.status}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {nextStatuses.map((s) => (
              <button
                key={s}
                type="button"
                disabled={statusPending}
                onClick={() => changeStatus(s)}
                className={`px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-60 ${ACTIONS[s].className}`}
              >
                {statusPending && targetStatus === s ? (
                  <>
                    <Spinner />
                    {ACTIONS[s].busy}
                  </>
                ) : (
                  ACTIONS[s].label
                )}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="px-2 py-1.5 text-xs text-[#4A5DF9] underline"
            >
              {open ? "Hide" : "Details"}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-2 text-xs text-red-600">
              {error}
            </p>
          )}
        </td>
      </tr>

      {open && (
        <tr className="bg-gray-50">
          <td colSpan={6} className="px-4 py-4">
            <dl className="grid gap-4 text-sm md:grid-cols-2">
              <Detail label="LinkedIn" value={app.linkedin} />
              <Detail label="Instagram" value={app.instagram} />
              <Detail label="Website" value={app.website} />
              <Detail label="Found us via" value={app.source} />
              <Detail label="Referral code" value={app.referralCode} />
              <Detail label="Reviewed" value={app.reviewedAt} />
              <Detail label="Passionate about" value={app.passion} />
              <Detail label="One message" value={app.oneMessage} />
              <Detail label="Why join" value={app.whyJoin} />
              <Detail label="Wants an intro to" value={app.introduction} />
            </dl>

            <div className="mt-4 space-y-2">
              <label
                htmlFor={`notes-${app.id}`}
                className="text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Internal notes
              </label>
              <textarea
                id={`notes-${app.id}`}
                rows={3}
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setSaved(false);
                }}
                className="w-full border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4A5DF9]"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={notesPending || !dirty}
                  onClick={submitNotes}
                  className="bg-[#4A5DF9] px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {notesPending ? (
                    <>
                      <Spinner />
                      Saving…
                    </>
                  ) : (
                    "Save notes"
                  )}
                </button>
                {saved && !dirty && <span className="text-xs text-green-700">Saved</span>}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
