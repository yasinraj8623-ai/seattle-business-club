"use client";

import React, { startTransition, useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { HoverScale } from "@/components/motion/HoverScale";
import { sendContactMessage, type ContactState } from "../actions";

const inputClass =
  "w-full border border-[#1F1F1F] bg-[rgba(11,11,19,0.70)] rounded-xs px-4 py-3 text-sm text-white placeholder:text-[#8C8C8C] leading-5 outline-none transition-colors focus:border-[#4A5DF9]";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm leading-normal text-[#F5F4F0]">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(sendContactMessage, { ok: false });
  const formRef = useRef<HTMLFormElement>(null);
  const hasErrors = (state.errors?.length ?? 0) > 0;

  // Clear the fields only on success. On errors keep what the user typed.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6 border border-[rgba(36,36,36,0.60)] bg-[rgba(0,0,0,0.64)] p-5 backdrop-blur-md sm:p-6"
    >
      {/* Honeypot: hidden from humans, bots tend to fill it */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="name">
          <input id="name" name="name" type="text" placeholder="Your name" required className={inputClass} />
        </Field>
        <Field label="Email Address" htmlFor="email">
          <input id="email" name="email" type="email" placeholder="you@email.com" required className={inputClass} />
        </Field>
      </div>

      <Field label="Subject" htmlFor="subject">
        <input id="subject" name="subject" type="text" placeholder="What's up here?" required className={inputClass} />
      </Field>

      <div className="border-t border-[#242424] pt-6">
        <Field label="Message" htmlFor="message">
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell us about more..."
            required
            className={`${inputClass} max-h-[220px] min-h-[100px] resize-y`}
          />
        </Field>
      </div>

      <HoverScale className="block w-full">
        <button
          type="submit"
          disabled={pending || state.ok}
          className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xs bg-[#5B9CFF] px-6 py-4 text-sm font-semibold text-[rgba(11,11,19,0.70)] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] transition-colors duration-300 ease-out hover:bg-[#4A5DF9] hover:bg-[radial-gradient(47.16%_130.25%_at_68.75%_-16.25%,rgba(255,255,255,0.30)_0%,rgba(255,255,255,0)_100%)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>{state.ok ? "Message Sent" : pending ? "Sending..." : "Send Message"}</span>
          <Send className="size-4" />
        </button>
      </HoverScale>

      {hasErrors && (
        <div role="alert" className="space-y-1 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.errors!.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      {state.ok && (
        <div role="status" className="border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          Thanks! Your message has been sent. We&rsquo;ll get back to you soon.
        </div>
      )}
    </form>
  );
}
