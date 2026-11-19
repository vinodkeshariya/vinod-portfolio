"use client";

import { useState } from "react";
import { budgets, projectTypes, site } from "@/lib/data";
import { Icon } from "./Icon";

type Status = "idle" | "sending" | "sent";

const field =
  "w-full min-h-[52px] rounded-[14px] border border-line-2 bg-paper px-4 py-3.5 text-[15px] text-ink transition placeholder:text-faint focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-soft aria-[invalid=true]:border-red-600";

/**
 * Front-end only contact form. It validates input and opens the visitor's
 * email client with a pre-filled message. Swap `onSubmit` for an API route,
 * Formspree, Resend, etc. when a backend is ready.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const next: Record<string, string> = {};
    if (!name) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Please enter a valid email address.";
    if (message.length < 10) next.message = "Tell me a little more about the project (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    const body = `Name: ${name}\nEmail: ${email}\nProject type: ${data.get("type")}\nBudget: ${data.get("budget") || "—"}\n\n${message}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Project inquiry from ${name}`)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => setStatus("sent"), 400);
  }

  if (status === "sent") {
    return (
      <div role="status" className="card flex flex-col items-start gap-4 p-8 md:p-10">
        <span className="grid size-14 place-items-center rounded-full bg-accent-soft text-accent">
          <Icon name="check" strokeWidth={2.4} className="size-7" />
        </span>
        <h2 className="text-[28px] font-bold">Thanks — your message is ready!</h2>
        <p className="text-muted">Your email app should have opened with the details filled in. I usually reply within 0–4 hours.</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStatus("idle")}>Send another inquiry</button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="card flex flex-col gap-6 p-6 sm:p-10">
      <div>
        <h2 className="text-[28px] font-bold">Project inquiry</h2>
        <p className="mt-1.5 text-muted">Fields marked * are required.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-ink-2">Full name *</label>
          <input id="name" name="name" autoComplete="name" placeholder="Your name" className={field}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
          {errors.name && <span id="name-err" className="text-[13px] text-red-700">{errors.name}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-ink-2">Email address *</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" className={field}
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
          {errors.email && <span id="email-err" className="text-[13px] text-red-700">{errors.email}</span>}
        </div>
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-sm font-medium text-ink-2">Project type</legend>
        <div className="flex flex-wrap gap-2.5">
          {projectTypes.map((t, i) => (
            <label key={t} className="relative">
              <input type="radio" name="type" value={t} defaultChecked={i === 0} className="peer sr-only" />
              <span className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line-2 px-4 text-sm text-ink-2 transition peer-checked:border-accent peer-checked:bg-accent peer-checked:font-semibold peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-ink-2">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="budget" className="text-sm font-medium text-ink-2">Estimated budget</label>
        <select id="budget" name="budget" defaultValue="" className={field}>
          <option value="">Select a range (optional)</option>
          {budgets.map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-ink-2">Project description *</label>
        <textarea id="message" name="message" rows={6} placeholder="Goals, timeline, links to designs or current site…"
          className={`${field} min-h-[150px] resize-y`}
          aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} />
        {errors.message && <span id="message-err" className="text-[13px] text-red-700">{errors.message}</span>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-[13px] text-faint">I usually reply within 0–4 hours.</span>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Opening email…" : "Send Project Inquiry"} <Icon name="send" />
        </button>
      </div>
    </form>
  );
}
