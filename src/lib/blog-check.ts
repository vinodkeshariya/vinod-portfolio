import { checkScene, pillars } from "./blog-meta.ts";
import { parseVisual } from "./blog-visuals.ts";

/**
 * Checks a blog post before it is saved (Payload hook), previewed or sent for approval.
 * No path aliases and no server-only imports, so the Payload config can use it too.
 */

export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** One per line → list */
export const toList = (v: unknown): string[] =>
  typeof v === "string"
    ? v
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

/** Markdown images: ![alt](src "optional caption") */
export function imageLinks(md: string) {
  return [...md.matchAll(/!\[([^\]]*)\]\(\s*<?([^\s)>]+)>?(?:\s+"[^"]*")?\s*\)/g)].map(([, alt, src]) => ({ alt, src }));
}

/**
 * File name of an image that lives in the Media library — its Vercel Blob URL, or /api/media/file/<name>
 * during local development — or null for anything else.
 */
export function mediaFilename(src: string): string | null {
  const local = src.match(/^\/api\/media\/file\/([^/?#]+)$/);
  if (local) return decodeURIComponent(local[1]);
  const blob = src.match(/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/(?:[^?#]*\/)?([^/?#]+)$/i);
  return blob ? decodeURIComponent(blob[1]) : null;
}

export type PostInput = {
  slug?: unknown;
  title?: unknown;
  description?: unknown;
  pillar?: unknown;
  service?: unknown;
  coverScene?: { kind?: unknown; labels?: unknown } | null;
  content?: unknown;
};

export type Problem = { field: string; message: string };

/**
 * Problems that stop a post from being saved, as { field, message }.
 * `mediaFiles` = file names in the Media library (images inside the post must be uploaded there).
 * `publishing` also rejects unfilled "[Vinod: …]" notes left by the AI writer.
 */
export function postProblems(p: PostInput, mediaFiles: Set<string>, publishing: boolean): Problem[] {
  const out: Problem[] = [];
  const add = (field: string, message: string) => out.push({ field, message });

  if (typeof p.slug !== "string" || !SLUG.test(p.slug)) add("slug", "Use lowercase words with dashes, e.g. my-first-post");
  if (typeof p.title !== "string" || !p.title.trim()) add("title", "The title is required");
  if (typeof p.description !== "string" || !p.description.trim()) add("description", "The description is required");
  else if (p.description.length > 170) add("description", `${p.description.length} characters — keep it under 170`);
  if (typeof p.pillar !== "string" || !(p.pillar in pillars)) add("pillar", "Choose a category");
  if (p.service && !(typeof p.service === "string" && p.service.startsWith("/services"))) add("service", "Must be a link starting with /services");

  if (p.coverScene?.kind) {
    try {
      checkScene({ kind: p.coverScene.kind, labels: toList(p.coverScene.labels) });
    } catch (e) {
      add("coverScene.labels", (e as Error).message.replace(/^coverScene /, "Cover illustration: "));
    }
  }

  const body = typeof p.content === "string" ? p.content : "";
  if (!body.trim()) add("content", "The post text is required");

  for (const { alt, src } of imageLinks(body)) {
    const file = mediaFilename(src);
    if (!alt.trim()) add("content", `Image ${src} needs a description: ![what it shows](${src})`);
    if (!file || !mediaFiles.has(file)) add("content", `Image ${src} is not in the Media library — upload it there and paste its URL`);
  }

  for (const [, json] of body.matchAll(/```visual[^\S\n]*\n([\s\S]*?)```/g)) {
    try {
      parseVisual(json);
    } catch (e) {
      add("content", (e as Error).message);
    }
  }

  if (publishing && /\[Vinod:/i.test(body)) {
    add("content", "Still has a [Vinod: …] note — fill it in or remove it before publishing");
  }
  return out;
}
