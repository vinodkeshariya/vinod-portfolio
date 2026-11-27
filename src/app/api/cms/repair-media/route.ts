import { list, put } from "@vercel/blob";
import sharp from "sharp";
import { fromBlogBot } from "@/lib/blog-autopost";
import { siteUrl } from "@/lib/data";
import { getPayloadClient } from "@/lib/payload";
import seed from "@/migrations/seed/content.json";

/**
 * ONE-OFF REPAIR (remove after use): the content migration created the Media records, but the files
 * never reached Vercel Blob. This re-uploads every missing file from the site's own /public copy
 * (and redraws the smaller sizes). Authorization: Bearer <BLOG_REVIEW_SECRET>.
 *   GET  → report only     POST → upload what's missing
 */
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const token = process.env.BLOB_READ_WRITE_TOKEN;

/** Media file name (as the migration named it) → its path in /public */
const sources = new Map(
  (seed as { media: { key: string; file: string }[] }).media.map((m) => [
    m.key.replace(/^projects\//, "").replace(/\//g, "-") + m.file.slice(m.file.lastIndexOf(".")),
    m.file.replace(/^public/, ""),
  ]),
);

async function report() {
  const existing = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await list({ token, cursor, limit: 1000 });
    page.blobs.forEach((b) => existing.add(b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "media", depth: 0, pagination: false });
  const media = docs.map((d) => {
    const files = [
      { name: d.filename!, width: d.width, height: d.height, mimeType: d.mimeType!, original: true },
      ...Object.values(d.sizes ?? {})
        .filter((s) => s?.filename)
        .map((s) => ({ name: s!.filename!, width: s!.width, height: s!.height, mimeType: s!.mimeType!, original: false })),
    ];
    return { id: d.id, source: sources.get(d.filename!) ?? null, files, missing: files.filter((f) => !existing.has(f.name)) };
  });
  return { tokenPresent: Boolean(token), blobsInStore: existing.size, sampleBlobs: [...existing].slice(0, 5), media };
}

export async function GET(req: Request) {
  if (!fromBlogBot(req)) return Response.json({ error: "Not allowed" }, { status: 401 });
  const r = await report();
  return Response.json({
    tokenPresent: r.tokenPresent,
    blobsInStore: r.blobsInStore,
    sampleBlobs: r.sampleBlobs,
    mediaRecords: r.media.length,
    filesMissing: r.media.reduce((n, m) => n + m.missing.length, 0),
    withoutSource: r.media.filter((m) => !m.source).map((m) => m.files[0].name),
  });
}

export async function POST(req: Request) {
  if (!fromBlogBot(req)) return Response.json({ error: "Not allowed" }, { status: 401 });
  const { media } = await report();
  const uploaded: string[] = [];
  const failed: string[] = [];

  const todo = media.filter((m) => m.missing.length && m.source);
  for (let i = 0; i < todo.length; i += 4) {
    await Promise.all(
      todo.slice(i, i + 4).map(async (m) => {
        try {
          const res = await fetch(`${siteUrl}${m.source}`);
          if (!res.ok) throw new Error(`source ${m.source}: HTTP ${res.status}`);
          const original = Buffer.from(await res.arrayBuffer());
          for (const f of m.missing) {
            const body =
              f.original || !f.width || !f.height
                ? original
                : await sharp(original).resize(f.width, f.height, { fit: "cover", position: "centre" }).toFormat("webp").toBuffer();
            await put(f.name, body, { access: "public", token, contentType: f.mimeType, addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 31_536_000 });
            uploaded.push(f.name);
          }
        } catch (e) {
          failed.push(`${m.files[0].name}: ${(e as Error).message}`);
        }
      }),
    );
  }
  return Response.json({ uploaded: uploaded.length, failed });
}
