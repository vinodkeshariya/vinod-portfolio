import "server-only";
import { unstable_cache } from "next/cache";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { CMS_TAG } from "@/cms/revalidate";
import type { Media, Post as PostDoc } from "@/payload-types";
import { imageLinks, mediaFilename, toList } from "./blog-check";
import { checkScene, defaultScenes, pillars, type Pillar, type Post, type PostMeta, type Scene } from "./blog-meta";
import { parseVisual, visualToHast } from "./blog-visuals";
import { siteUrl } from "./data";
import { cmsCacheKey } from "./cache-key";
import { getPayloadClient } from "./payload";

export * from "./blog-meta";

/**
 * Blog posts live in the CMS (Payload → Blog posts). Only published posts are shown on the site;
 * drafts are previewed through the signed review link (/blog/review/<id>).
 * The post text is Markdown. Raw HTML inside it is dropped, so a post can't run scripts.
 *
 * Images inside a post: upload to Media, then ![What the image shows](<media URL> "Optional caption")
 * Designed visuals (steps / compare / checklist): a ```visual code block with JSON — see ./blog-visuals.ts.
 */

/** A post ready to render: its details, Markdown body and the sizes of the images it uses */
export type PostEntry = { meta: PostMeta; body: string; images: Record<string, { width: number; height: number }> };

/** "2026-11-21" — the post's date in India time */
const day = (iso: string | null | undefined) =>
  iso ? new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso)) : "";

function sceneOf(doc: PostDoc, pillar: Pillar): Scene {
  if (!doc.coverScene?.kind) return defaultScenes[pillar];
  try {
    return checkScene({ kind: doc.coverScene.kind, labels: toList(doc.coverScene.labels) });
  } catch {
    return defaultScenes[pillar];
  }
}

/** CMS document → the post details the components use */
export function toMeta(doc: PostDoc): PostMeta {
  const pillar = (doc.pillar in pillars ? doc.pillar : "web-development") as Pillar;
  const cover = doc.cover && typeof doc.cover === "object" && doc.cover.url ? (doc.cover as Media) : null;
  const words = (doc.content ?? "").split(/\s+/).filter(Boolean).length;
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    date: day(doc.date),
    updated: doc.updated ? day(doc.updated) : undefined,
    pillar,
    tags: toList(doc.tags),
    service: doc.service || pillars[pillar].service,
    cover: cover ? { src: cover.url!, alt: cover.alt, width: cover.width ?? 1600, height: cover.height ?? 1000 } : null,
    scene: sceneOf(doc, pillar),
    aiAssisted: doc.aiAssisted !== false,
    reviewed: doc.reviewed !== false,
    draft: doc._status !== "published",
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
}

/** Turns CMS documents into entries, looking up the size of every image they use (one query) */
export async function toEntries(docs: PostDoc[]): Promise<PostEntry[]> {
  const names = [...new Set(docs.flatMap((d) => imageLinks(d.content ?? "").map((i) => mediaFilename(i.src)).filter((n): n is string => Boolean(n))))];
  const sizes: Record<string, { width: number; height: number }> = {};
  if (names.length) {
    const payload = await getPayloadClient();
    const { docs: files } = await payload.find({ collection: "media", where: { filename: { in: names } }, depth: 0, pagination: false });
    for (const f of files) if (f.filename && f.width && f.height) sizes[f.filename] = { width: f.width, height: f.height };
  }
  return docs.map((d) => ({ meta: toMeta(d), body: d.content ?? "", images: sizes }));
}

async function loadPublished(): Promise<PostEntry[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    sort: ["-date", "slug"],
    depth: 1,
    pagination: false,
  });
  return toEntries(docs);
}

const published = unstable_cache(loadPublished, ["cms-posts", ...cmsCacheKey], {
  tags: [CMS_TAG],
});

/** Published posts, newest first */
export async function getPosts(): Promise<PostMeta[]> {
  return (await published()).map((p) => p.meta);
}

export async function getPost(slug: string): Promise<Post | null> {
  const entry = (await published()).find((p) => p.meta.slug === slug);
  return entry ? renderPost(entry) : null;
}

/* ---------------- Markdown → HTML ---------------- */

/** Minimal HTML-tree shape (hast) used by the small plugins below */
type Node = { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: Node[] };

const textOf = (node: Node): string => (node.type === "text" ? (node.value ?? "") : (node.children ?? []).map(textOf).join(""));

function walk(node: Node, fn: (n: Node) => void) {
  fn(node);
  node.children?.forEach((c) => walk(c, fn));
}

/** Collects h2 headings (after rehype-slug gave them ids) for the "On this page" nav */
const collectHeadings = (out: { id: string; label: string }[]) => () => (tree: Node) =>
  walk(tree, (n) => {
    if (n.type === "element" && n.tagName === "h2" && typeof n.properties?.id === "string") {
      out.push({ id: n.properties.id, label: textOf(n) });
    }
  });

/** Highlights "[Vinod: …]" review notes in drafts so they're easy to spot */
const markReviewNotes = () => (tree: Node) =>
  walk(tree, (n) => {
    if (n.tagName === "p" && /^\s*\[Vinod:/i.test(textOf(n))) n.properties = { ...n.properties, className: ["review-note"] };
  });

/**
 * Images: adds size + lazy loading, and turns an image on its own line into a <figure>
 * (its Markdown title becomes the caption).
 */
const images = (sizes: PostEntry["images"]) => () => (tree: Node) =>
  walk(tree, (n) => {
    if (n.tagName === "img" && typeof n.properties?.src === "string") {
      const name = mediaFilename(n.properties.src);
      const size = name ? sizes[name] : undefined;
      n.properties = { ...n.properties, loading: "lazy", decoding: "async", ...(size ?? {}) };
    }
    const only = n.tagName === "p" && n.children?.filter((c) => !(c.type === "text" && !c.value?.trim()));
    if (only && only.length === 1 && only[0].tagName === "img") {
      const img = only[0];
      const caption = typeof img.properties?.title === "string" ? img.properties.title : "";
      if (img.properties) delete img.properties.title;
      n.tagName = "figure";
      n.children = caption
        ? [img, { type: "element", tagName: "figcaption", properties: {}, children: [{ type: "text", value: caption }] }]
        : [img];
    }
  });

/** Turns ```visual code blocks into designed diagrams (a broken one is left out rather than breaking the page) */
const visuals = () => (tree: Node) =>
  walk(tree, (n) => {
    const code = n.tagName === "pre" ? n.children?.find((c) => c.tagName === "code") : undefined;
    const cls = code?.properties?.className;
    if (code && Array.isArray(cls) && cls.includes("language-visual")) {
      try {
        Object.assign(n, visualToHast(parseVisual(textOf(code))));
      } catch {
        Object.assign(n, { type: "comment", value: "invalid visual", children: undefined, tagName: undefined });
      }
    }
  });

/** Opens links to other websites in a new tab */
const externalLinks = () => (tree: Node) =>
  walk(tree, (n) => {
    const href = n.tagName === "a" ? n.properties?.href : undefined;
    if (typeof href === "string" && /^https?:\/\//.test(href) && !href.startsWith(siteUrl)) {
      n.properties = { ...n.properties, target: "_blank", rel: ["noopener", "noreferrer"] };
    }
  });

/** Turns a post into HTML (+ its h2 headings for the "On this page" nav) */
export async function renderPost(entry: PostEntry): Promise<Post> {
  const headings: { id: string; label: string }[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype) // raw HTML in Markdown is dropped here
    .use(rehypeSanitize)
    .use(rehypeSlug)
    .use(collectHeadings(headings))
    .use(markReviewNotes)
    .use(visuals)
    .use(images(entry.images))
    .use(externalLinks)
    .use(rehypeStringify)
    .process(entry.body);
  return { ...entry.meta, html: String(file), headings };
}
