import { fromBlogBot, notifyProblem, savePost, writerContext, type NewPost } from "@/lib/blog-autopost";

/**
 * Used by the weekly blog GitHub Action (scripts/blog/autopost.mjs). Needs Authorization: Bearer <BLOG_REVIEW_SECRET>.
 *   GET   → the facts, links and existing posts the writer may use
 *   POST  { action: "save", post, issues, autoPublish } → stores the post as a draft (or publishes it) and emails Vinod
 *   POST  { action: "notify", result: "none" | "failed", issues, runUrl } → emails Vinod that nothing was written
 */
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!fromBlogBot(req)) return Response.json({ error: "Not allowed" }, { status: 401 });
  return Response.json(await writerContext());
}

export async function POST(req: Request) {
  if (!fromBlogBot(req)) return Response.json({ error: "Not allowed" }, { status: 401 });
  let body: { action?: string; post?: NewPost; issues?: unknown; autoPublish?: boolean; result?: string; runUrl?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const issues = Array.isArray(body.issues) ? body.issues.map(String).slice(0, 30) : [];

  try {
    if (body.action === "save" && body.post) {
      return Response.json(await savePost({ post: body.post, issues, autoPublish: body.autoPublish === true }));
    }
    if (body.action === "notify" && (body.result === "none" || body.result === "failed")) {
      return Response.json({ sent: await notifyProblem({ result: body.result, issues, runUrl: body.runUrl }) });
    }
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 422 });
  }
  return Response.json({ error: "Unknown action" }, { status: 400 });
}
