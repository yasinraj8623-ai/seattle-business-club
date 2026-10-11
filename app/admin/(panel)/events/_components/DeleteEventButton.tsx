"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { deleteEvent } from "../actions";

export default function DeleteEventButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Delete "${title}"?`)) return;

          setError(null);
          startTransition(async () => {
            const res = await deleteEvent(id);
            if (!res.ok) setError(res.error);
          });
        }}
      >
        {pending ? "Deleting…" : "Delete"}
      </Button>
      {error && <span className="ml-2 text-xs text-red-600">{error}</span>}
    </>
  );
}
