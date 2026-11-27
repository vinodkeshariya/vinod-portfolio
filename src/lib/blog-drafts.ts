import "server-only";
import type { Post as PostDoc } from "@/payload-types";
import { toEntries, renderPost } from "./blog";
import { toList } from "./blog-check";
import type { Post } from "./blog-meta";
import { getPayloadClient } from "./payload";

/**
 * Blog drafts waiting for approval (Payload → Blog posts, status "Draft").
 * Used by the private review page (/blog/review/<id>), its Publish / Don't publish buttons
 * and the weekly auto-post API.
 */

export type Draft = {
  id: number;
  /** "open" = still a draft, "published" = live, "removed" = deleted / never existed */
  state: "open" | "published";
  doc: PostDoc;
  post: Post;
  /** What the auto-post checks flagged (empty when everything passed) */
  issues: string[];
};

/** The latest version of a post (draft or published), rendered like the live page; null if it doesn't exist */
export async function getDraft(id: number): Promise<Draft | null> {
  const payload = await getPayloadClient();
  const doc = await payload.findByID({ collection: "posts", id, draft: true, depth: 1, disableErrors: true });
  if (!doc) return null;
  const [entry] = await toEntries([doc]);
  return {
    id,
    state: doc._status === "published" ? "published" : "open",
    doc,
    post: await renderPost(entry),
    issues: toList(doc.reviewNotes),
  };
}

/** Publishes the latest draft. The post's checks run here too (see the Posts collection) */
export async function publishDraft(id: number): Promise<{ ok: boolean; message: string }> {
  const payload = await getPayloadClient();
  const doc = await payload.findByID({ collection: "posts", id, draft: true, depth: 0, disableErrors: true });
  if (!doc) return { ok: false, message: "This draft could not be found — it may have been removed." };
  if (doc._status === "published") return { ok: true, message: "Already published." };
  const { id: _id, createdAt: _c, updatedAt: _u, _status, ...data } = doc;
  try {
    await payload.update({ collection: "posts", id, data: { ...data, _status: "published" } });
    return { ok: true, message: "Published." };
  } catch (e) {
    const err = e as { message: string; data?: { errors?: { message: string }[] } };
    return { ok: false, message: err.data?.errors?.map((x) => x.message).join(" · ") || err.message };
  }
}

/** Deletes a draft that was never published */
export async function rejectDraft(id: number): Promise<{ ok: boolean; message: string }> {
  const payload = await getPayloadClient();
  const doc = await payload.findByID({ collection: "posts", id, draft: true, depth: 0, disableErrors: true });
  if (!doc) return { ok: true, message: "Already removed." };
  if (doc._status === "published") return { ok: false, message: "This post is already live — remove it in the admin if you really want to." };
  await payload.delete({ collection: "posts", id });
  return { ok: true, message: "Removed." };
}
