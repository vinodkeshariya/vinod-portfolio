"use server";

import { redirect } from "next/navigation";
import { publishDraft, rejectDraft } from "@/lib/github";
import { verifyReview } from "@/lib/review-link";

/** Reads and re-checks the signed link that came with the form — the buttons only work for the emailed link */
function checked(form: FormData) {
  const pr = Number(form.get("pr"));
  const exp = Number(form.get("exp"));
  const sig = String(form.get("sig") ?? "");
  if (verifyReview(pr, exp, sig, process.env.BLOG_REVIEW_SECRET) !== "ok") throw new Error("This review link is invalid or has expired.");
  return { pr, back: `/blog/review/${pr}?exp=${exp}&sig=${encodeURIComponent(sig)}` };
}

/** Runs a GitHub action and turns any failure into a message for the page (redirect() must stay outside try) */
async function attempt(run: () => Promise<{ ok: boolean; message: string }>) {
  try {
    return await run();
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}

export async function publishPost(form: FormData) {
  const { pr, back } = checked(form);
  const title = String(form.get("title") ?? "").slice(0, 120);
  const res = await attempt(() => publishDraft(pr, title));
  redirect(res.ok ? back : `${back}&error=${encodeURIComponent(res.message)}`);
}

export async function rejectPost(form: FormData) {
  const { pr, back } = checked(form);
  const res = await attempt(() => rejectDraft(pr));
  redirect(res.ok ? back : `${back}&error=${encodeURIComponent(res.message)}`);
}
