/**
 * Keeps the live site in step with the CMS: after any change, every page that shows CMS content is
 * marked out of date, so the next visit renders it fresh (no redeploy needed).
 * Pages read the CMS through cached functions tagged CMS_TAG (src/lib/content.ts, src/lib/blog.ts).
 */
export const CMS_TAG = "cms";

export async function revalidateSite(context?: Record<string, unknown>) {
  if (context?.skipRevalidate) return;
  try {
    const { revalidatePath, revalidateTag } = await import("next/cache");
    revalidateTag(CMS_TAG, { expire: 0 });
    revalidatePath("/", "layout");
  } catch {
    // outside a Next.js request (e.g. `payload migrate`) there is no page cache to clear
  }
}

/** Collection hooks: `hooks: { afterChange: [afterChange], afterDelete: [afterDelete] }` */
export const afterChange = async ({ doc, context }: { doc: unknown; context: Record<string, unknown> }) => {
  await revalidateSite(context);
  return doc;
};

export const afterDelete = async ({ doc, context }: { doc: unknown; context: Record<string, unknown> }) => {
  await revalidateSite(context);
  return doc;
};
