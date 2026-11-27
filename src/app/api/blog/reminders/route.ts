import { fromBlogBot, runReminders } from "@/lib/blog-autopost";

/**
 * POST — daily check of auto-written drafts (reminder after 3 days, removed after 7).
 * Called by .github/workflows/blog-reminders.yml with Authorization: Bearer <BLOG_REVIEW_SECRET>.
 */
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!fromBlogBot(req)) return Response.json({ error: "Not allowed" }, { status: 401 });
  return Response.json(await runReminders());
}
