"use server";

import { z } from "zod";
import { Resend } from "resend";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { applicationSchema } from "@/lib/validation";

export type ApplyState = { ok: boolean; errors?: string[] };

export async function submitApplication(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  // Honeypot: bots fill this hidden field, humans don't. Pretend success.
  if (formData.get("company")) return { ok: true };

  const parsed = applicationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors as Record<string, string[]>;
    return {
      ok: false,
      errors: Object.entries(fieldErrors).map(([field, msgs]) => `${field}: ${msgs[0]}`),
    };
  }

  const data = parsed.data;

  try {
    const inserted = await db
      .insert(applications)
      .values(data)
      .onConflictDoNothing({ target: applications.email })
      .returning({ id: applications.id });

    if (inserted.length === 0) {
      return { ok: false, errors: ["An application with this email already exists."] };
    }
  } catch (err) {
    console.error("submitApplication failed", err);
    return { ok: false, errors: ["Something went wrong. Please try again in a moment."] };
  }

  if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
    try {
      await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: "SBC Applications <onboarding@resend.dev>", // swap for your verified domain
        to: process.env.NOTIFY_EMAIL,
        subject: `New application: ${data.firstName} ${data.lastName}`,
        text: `${data.email}\n${data.linkedin}\n\n${data.whyJoin}`,
      });
    } catch (err) {
      console.error("notify email failed", err); // never fail the application over this
    }
  }

  return { ok: true };
}
