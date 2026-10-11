"use server";

import { z } from "zod";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-validation";

export type ContactState = { ok: boolean; errors?: string[] };

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: bots fill this hidden field, humans don't. Pretend success.
  if (formData.get("company")) return { ok: true };

  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors as Record<string, string[]>;
    return {
      ok: false,
      errors: Object.entries(fieldErrors).map(([field, msgs]) => `${field}: ${msgs[0]}`),
    };
  }

  const { name, email, subject, message } = parsed.data;

  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.error("sendContactMessage: RESEND_API_KEY or NOTIFY_EMAIL is missing");
    return { ok: false, errors: ["Something went wrong. Please try again in a moment."] };
  }

  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "SBC Contact <onboarding@contact.seattlebusinessclub.com>", // swap for your verified domain
      to: process.env.NOTIFY_EMAIL,
      replyTo: email,
      subject: `Contact: ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (error) throw error;
  } catch (err) {
    console.error("sendContactMessage failed", err);
    return { ok: false, errors: ["Could not send your message. Please try again in a moment."] };
  }

  return { ok: true };
}
