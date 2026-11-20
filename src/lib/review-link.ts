import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed links for approving auto-written blog posts:  <site>/blog/review/<pr>?exp=<unix>&sig=<hmac>
 * The email holds the link; the page checks the signature and expiry before showing anything.
 * Secret: BLOG_REVIEW_SECRET (same value in Vercel and in the GitHub Action).
 * No path aliases, so the Node scripts in /scripts can import it too.
 */

export const REVIEW_DAYS = 7;

export function signReview(pr: number, exp: number, secret: string) {
  return createHmac("sha256", secret).update(`blog-review:${pr}:${exp}`).digest("base64url");
}

export function reviewUrl(siteUrl: string, pr: number, exp: number, secret: string) {
  return `${siteUrl}/blog/review/${pr}?exp=${exp}&sig=${signReview(pr, exp, secret)}`;
}

/** "ok", "expired" (valid but too old) or "invalid" */
export function verifyReview(pr: number, exp: number, sig: string | undefined, secret: string | undefined, now = Date.now() / 1000) {
  if (!secret || !sig || !Number.isInteger(pr) || pr <= 0 || !Number.isInteger(exp)) return "invalid" as const;
  const expected = Buffer.from(signReview(pr, exp, secret));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid" as const;
  return now > exp ? ("expired" as const) : ("ok" as const);
}
