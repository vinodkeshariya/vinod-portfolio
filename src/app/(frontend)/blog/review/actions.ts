"use server";

import { redirect } from "next/navigation";
import { publishDraft, rejectDraft } from "@/lib/blog-drafts";
import { verifyReview } from "@/lib/review-link";

/** Reads and re-checks the signed link that came with the form — the buttons only work for a valid review link */
function checked(form: FormData) {
  const id = Number(form.get("id"));
  const exp = Number(form.get("exp"));
  const sig = String(form.get("sig") ?? "");
  if (verifyReview(id, exp, sig, process.env.BLOG_REVIEW_SECRET) !== "ok") throw new Error("This review link is invalid or has expired.");
  return { id, back: `/blog/review/${id}?exp=${exp}&sig=${encodeURIComponent(sig)}` };
}

/** Runs a CMS action and turns any failure into a message for the page (redirect() must stay outside try) */
async function attempt(run: () => Promise<{ ok: boolean; message: string }>) {
  try {
    return await run();
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}

export async function publishPost(form: FormData) {
  const { id, back } = checked(form);
  const res = await attempt(() => publishDraft(id));
  redirect(res.ok ? back : `${back}&error=${encodeURIComponent(res.message)}`);
}

export async function rejectPost(form: FormData) {
  const { id, back } = checked(form);
  const res = await attempt(() => rejectDraft(id));
  redirect(res.ok ? `${back}&removed=1` : `${back}&error=${encodeURIComponent(res.message)}`);
}
