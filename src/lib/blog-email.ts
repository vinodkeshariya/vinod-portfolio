import "server-only";
import { siteUrl } from "./data";
import { REVIEW_DAYS, reviewPath } from "./review-link";

/**
 * Emails about the weekly blog (approval request, published, reminders, problems), sent to the site owner
 * through Resend. Env: RESEND_API_KEY, BLOG_REVIEW_SECRET, optional CONTACT_FROM.
 */

/** Signed preview + approval link for a draft; valid for REVIEW_DAYS from `fromMs` */
export function approvalLink(id: number, fromMs = Date.now()) {
  const secret = process.env.BLOG_REVIEW_SECRET;
  if (!secret || !id) return null;
  const exp = Math.floor(fromMs / 1000) + REVIEW_DAYS * 86_400;
  return { url: `${siteUrl}${reviewPath(id, exp, secret)}`, expires: new Date(exp * 1000) };
}

export const dateIN = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "Asia/Kolkata" }).format(d);

const esc = (s: string) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

type Block = string | string[];

/** Simple branded email: label, heading, paragraphs / bullet lists, one button */
export function emailHtml({ label, heading, blocks = [], button, footnote }: { label: string; heading: string; blocks?: Block[]; button?: { label: string; url: string } | null; footnote?: string | null }) {
  const block = (b: Block) =>
    Array.isArray(b)
      ? `<ul style="margin:0 0 16px;padding-left:20px;color:#3c423b;font-size:15px;line-height:1.6;">${b.map((i) => `<li style="margin:0 0 6px;">${esc(i)}</li>`).join("")}</ul>`
      : `<p style="margin:0 0 16px;color:#3c423b;font-size:15px;line-height:1.65;">${esc(b)}</p>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:#f5f3ec;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f3ec;"><tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e1e2d9;border-radius:18px;overflow:hidden;font-family:${FONT};">
<tr><td style="background:#153d35;padding:26px 28px;">
<p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#b9d96c;">&#9679;&nbsp; ${esc(label)}</p>
<h1 style="margin:0;font-size:22px;line-height:1.35;font-weight:800;color:#ffffff;">${esc(heading)}</h1>
</td></tr>
<tr><td style="padding:24px 28px 8px;">${blocks.map(block).join("")}</td></tr>
${
  button
    ? `<tr><td style="padding:4px 28px 26px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#153d35;border-radius:999px;">
<a href="${esc(button.url)}" style="display:inline-block;padding:14px 26px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">${esc(button.label)} &rarr;</a>
</td></tr></table>${footnote ? `<p style="margin:12px 0 0;font-size:13px;color:#565d55;">${esc(footnote)}</p>` : ""}</td></tr>`
    : ""
}
</table>
<p style="margin:18px 0 0;font-family:${FONT};font-size:12px;color:#565d55;">Weekly blog · <a href="${siteUrl}/blog" style="color:#565d55;">${esc(siteUrl.replace(/^https?:\/\//, ""))}/blog</a></p>
</td></tr></table></body></html>`;
}

/** Sends an email to `to` through Resend; skips quietly when RESEND_API_KEY isn't set */
export async function sendMail({ to, subject, text, html }: { to: string; subject: string; text: string; html: string }) {
  if (!process.env.RESEND_API_KEY || !to) {
    console.log(`[blog-mail] not sent (no RESEND_API_KEY or address): ${subject}`);
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.CONTACT_FROM || "Portfolio Blog <onboarding@resend.dev>", to: [to], subject, text, html }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) console.error(`[blog-mail] ${subject}: failed (${res.status} ${await res.text()})`);
  return res.ok;
}
