import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed links for previewing and approving blog drafts:  /blog/review/<post id>?exp=<unix>&sig=<hmac>
 * The approval email (and the admin's Preview button) holds the link; the page checks the signature and
 * expiry before showing anything. Secret: BLOG_REVIEW_SECRET (same value in Vercel and the GitHub Action).
 * No path aliases, so the Payload config can import it too.
 */

export const REVIEW_DAYS = 7;

export function signReview(id: number, exp: number, secret: string) {
  return createHmac("sha256", secret).update(`blog-review:${id}:${exp}`).digest("base64url");
}

export function reviewPath(id: number, exp: number, secret: string) {
  return `/blog/review/${id}?exp=${exp}&sig=${signReview(id, exp, secret)}`;
}

/** "ok", "expired" (valid but too old) or "invalid" */
export function verifyReview(id: number, exp: number, sig: string | undefined, secret: string | undefined, now = Date.now() / 1000) {
  if (!secret || !sig || !Number.isInteger(id) || id <= 0 || !Number.isInteger(exp)) return "invalid" as const;
  const expected = Buffer.from(signReview(id, exp, secret));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid" as const;
  return now > exp ? ("expired" as const) : ("ok" as const);
}
