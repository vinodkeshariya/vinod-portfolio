"use client";

import { useState, useTransition } from "react";
import { sendInquiry } from "@/app/(frontend)/contact/actions";
import { track } from "@/lib/analytics";
import type { PageTexts } from "@/lib/data";
import { Icon } from "./Icon";

type Status = "idle" | "sent" | "failed" | "limited";

const field =
  "w-full min-h-12 rounded-[12px] border border-line-2 bg-surface px-4 py-3 text-[15px] text-ink transition placeholder:text-placeholder hover:border-accent/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-lime/40 aria-[invalid=true]:border-red-600";

const card = "relative rounded-[22px] border border-line bg-surface p-6 shadow-[0_2px_4px_rgb(36_40_36/0.05),0_40px_70px_-30px_rgb(21_61_53/0.35)] sm:p-8";

const text = (data: FormData, key: string) => String(data.get(key) || "").trim();

/** Pre-filled email for the fallback "open in your email app" link */
function mailtoHref(email: string, data: FormData) {
  const body = `Name: ${text(data, "name")}\nEmail: ${text(data, "email")}\nCompany / website: ${text(data, "company") || "—"}\nProject type: ${text(data, "type")}\nBudget: ${text(data, "budget") || "—"}\n\n${text(data, "message")}`;
  return `mailto:${email}?subject=${encodeURIComponent(`Project inquiry from ${text(data, "name")}`)}&body=${encodeURIComponent(body)}`;
}

/**
 * Contact form. Validates in the browser, then sends the inquiry to the inbox
 * through the `sendInquiry` Server Action (Resend). If sending fails, the
 * visitor can still open their email app with the message pre-filled.
 * The email address, the options and every label come from the CMS (via the contact page).
 */
export function ContactForm({
  email,
  budgets,
  projectTypes,
  labels: l,
}: {
  email: string;
  budgets: string[];
  projectTypes: string[];
  labels: PageTexts["contact"]["form"];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fallback, setFallback] = useState(`mailto:${email}`);
  const [sending, startSending] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const next: Record<string, string> = {};
    if (!text(data, "name")) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(data, "email"))) next.email = "Please enter a valid email address.";
    if (text(data, "message").length < 10) next.message = "Tell me a little more about the project (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("idle");
    setFallback(mailtoHref(email, data));
    startSending(async () => {
      try {
        const res = await sendInquiry(data);
        if (res.ok) {
          // no personal data — only what helps see which services bring leads
          track("generate_lead", { form: "contact", project_type: text(data, "type"), budget: text(data, "budget") || "not_set" });
          return setStatus("sent");
        }
        if (res.reason === "invalid") return setErrors(res.errors ?? {});
        setStatus(res.reason === "limited" ? "limited" : "failed");
      } catch {
        setStatus("failed");
      }
    });
  }

  if (status === "sent") {
    return (
      <div role="status" className={`${card} flex flex-col items-start gap-4`}>
        <span className="grid size-14 place-items-center rounded-full bg-accent text-lime">
          <Icon name="check" strokeWidth={2.4} className="size-7" />
        </span>
        <h2 className="text-[26px] font-bold text-accent">{l.sentTitle}</h2>
        <p className="text-muted">{l.sentText}</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStatus("idle")}>{l.sentAgain}</button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className={`${card} flex flex-col gap-5`}>
      {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored */}
      <div aria-hidden="true" className="absolute left-[-9999px] size-px overflow-hidden">
        <label htmlFor="botcheck">Leave this field empty</label>
        <input id="botcheck" name="botcheck" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px] font-bold tracking-[-0.02em] text-accent">{l.title}</h2>
          <p className="mt-1 text-[14px] text-muted">{l.note}</p>
        </div>
        <span aria-hidden="true" className="mt-2 flex gap-1.5">
          <i className="size-2 rounded-full bg-lime" />
          <i className="size-2 rounded-full bg-accent-line" />
          <i className="size-2 rounded-full bg-line-2" />
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-ink-2">{l.name}</label>
          <input id="name" name="name" autoComplete="name" placeholder={l.namePlaceholder} className={field}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
          {errors.name && <span id="name-err" className="text-[13px] text-red-700">{errors.name}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-ink-2">{l.email}</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder={l.emailPlaceholder} className={field}
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
          {errors.email && <span id="email-err" className="text-[13px] text-red-700">{errors.email}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="company" className="text-sm font-medium text-ink-2">
          {l.company} <span className="font-normal text-faint">{l.optional}</span>
        </label>
        <input id="company" name="company" autoComplete="organization" placeholder={l.companyPlaceholder} className={field} />
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-sm font-medium text-ink-2">{l.type}</legend>
        <div className="flex flex-wrap gap-2.5">
          {projectTypes.map((t, i) => (
            <label key={t} className="relative">
              <input type="radio" name="type" value={t} defaultChecked={i === 0} className="peer sr-only" />
              <span className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-line-2 px-3.5 text-[13.5px] text-ink-2 transition peer-checked:border-accent peer-checked:bg-accent peer-checked:font-semibold peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-ink-2">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="budget" className="text-sm font-medium text-ink-2">{l.budget} <span className="font-normal text-faint">{l.optional}</span></label>
        <select id="budget" name="budget" defaultValue="" className={field}>
          <option value="">{l.budgetPlaceholder}</option>
          {budgets.map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-ink-2">{l.message}</label>
        <textarea id="message" name="message" rows={5} placeholder={l.messagePlaceholder}
          className={`${field} min-h-[130px] resize-y`}
          aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} />
        {errors.message && <span id="message-err" className="text-[13px] text-red-700">{errors.message}</span>}
      </div>

      {(status === "failed" || status === "limited") && (
        <div role="alert" className="flex flex-col items-start gap-3 rounded-[12px] border border-red-200 bg-red-50 p-4 text-[14px] text-red-800">
          <p>
            {status === "limited" ? l.limited : l.failed}
          </p>
          <a href={fallback} className="btn btn-line btn-sm">
            {l.fallback} <Icon name="mail" />
          </a>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button type="submit" className="btn btn-primary min-h-14 w-full text-[16px]" disabled={sending} aria-busy={sending}>
          {sending ? l.sending : l.submit} <Icon name="send" />
        </button>
        <span className="text-center text-[13px] text-muted">{l.reply}</span>
      </div>
    </form>
  );
}
