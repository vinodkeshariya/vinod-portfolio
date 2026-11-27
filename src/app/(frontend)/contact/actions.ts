"use server";

import { headers } from "next/headers";
import { budgets, projectTypes, site } from "@/lib/data";
import { inquiryEmail } from "@/lib/inquiry-email";

export type InquiryResult = { ok: true } | { ok: false; reason: "invalid" | "limited" | "unavailable"; errors?: Record<string, string> };

/** Read a form field as trimmed text, capped at `max` characters */
const field = (data: FormData, key: string, max: number) => String(data.get(key) ?? "").trim().slice(0, max);

/**
 * Best-effort spam brake: max 5 inquiries per IP per 15 minutes.
 * Lives in memory, so it resets on cold starts — it only has to stop bursts, not be exact.
 */
const WINDOW = 15 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= LIMIT) return true;
  hits.set(ip, [...recent, now]);
  if (hits.size > 500) hits.clear();
  return false;
}

/**
 * Sends a project inquiry to the site owner's inbox through Resend.
 * Env: RESEND_API_KEY (required), CONTACT_FROM (optional — set once a domain is verified in Resend).
 */
export async function sendInquiry(data: FormData): Promise<InquiryResult> {
  // Honeypot: real visitors never see or fill this field, bots usually do.
  if (field(data, "botcheck", 200)) return { ok: true };

  const name = field(data, "name", 100).replace(/\s+/g, " ");
  const email = field(data, "email", 200);
  const company = field(data, "company", 200);
  const type = field(data, "type", 80);
  const budget = field(data, "budget", 80);
  const message = field(data, "message", 5000);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
  if (message.length < 10) errors.message = "Tell me a little more about the project (10+ characters).";
  if (Object.keys(errors).length) return { ok: false, reason: "invalid", errors };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return { ok: false, reason: "limited" };

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set");
    return { ok: false, reason: "unavailable" };
  }

  const { subject, text, html } = inquiryEmail({
    name,
    email,
    company,
    // only accept the options the form offers
    type: (projectTypes as readonly string[]).includes(type) ? type : "",
    budget: (budgets as readonly string[]).includes(budget) ? budget : "",
    message,
    siteUrl: site.url,
    receivedAt: new Date(),
  });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Portfolio Contact <onboarding@resend.dev>",
        to: [site.email],
        reply_to: email,
        subject,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[contact] Resend rejected the email:", res.status, await res.text());
      return { ok: false, reason: "unavailable" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[contact] Could not reach Resend:", err);
    return { ok: false, reason: "unavailable" };
  }
}
