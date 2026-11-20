import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { imageSize } from "image-size";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { checkScene, defaultScenes, pillars, type Pillar, type Post, type PostMeta } from "./blog-meta";
import { parseVisual, visualToHast } from "./blog-visuals";
import { site } from "./data";

export * from "./blog-meta";

/**
 * Blog posts are Markdown files in /content/blog (one file per post, file name = URL slug).
 * Files starting with "_" are ignored. Raw HTML inside Markdown is dropped, so a post can't run scripts.
 *
 * Frontmatter:
 *   title        (required)  post title, also the <title> tag
 *   description  (required)  1–2 sentence summary for Google / social cards, max 170 characters
 *   date         (required)  publish date, YYYY-MM-DD
 *   pillar       (required)  category — one of the keys in `pillars` (./blog-meta.ts)
 *   tags                      list of short keywords
 *   service                   related service link, e.g. "/services#service-5" (defaults to the pillar's)
 *   cover, coverAlt           cover image from /public/images (e.g. "/images/blog/my-post/cover.webp") and its
 *                             description; without one, a branded cover is generated automatically
 *   coverScene                illustration for the generated cover/hero: { kind, labels } — see SCENES in ./blog-meta.ts
 *                             (defaults to the category's scene)
 *   updated                   YYYY-MM-DD, when the post was meaningfully changed
 *   aiAssisted                true (default) shows a note that AI helped write the post
 *   reviewed                  true (default): "Drafted with AI, reviewed and edited by Vinod";
 *                             false (auto-published posts): "Written with AI assistance, based on my workflow and services"
 *   draft                     true hides the post everywhere except `next dev`
 *
 * Images inside a post: ![What the image shows](/images/blog/my-post/screen.webp "Optional caption")
 * Every image needs a description and must exist in /public/images — the build stops otherwise.
 *
 * Designed visuals (steps / compare / checklist): a ```visual code block with JSON — see ./blog-visuals.ts.
 */

const DIR = path.join(process.cwd(), "content", "blog");
const PUBLIC = path.join(process.cwd(), "public");

/** Width/height of an image in /public (so the page doesn't jump while it loads), or null if missing */
function localImage(src: string): { width: number; height: number } | null {
  if (!/^\/images\/[\w./-]+\.(webp|png|jpe?g|avif|gif)$/i.test(src) || src.includes("..")) return null;
  try {
    const { width, height } = imageSize(fs.readFileSync(path.join(PUBLIC, src)));
    return width && height ? { width, height } : null;
  } catch {
    return null;
  }
}
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const showDrafts = process.env.NODE_ENV === "development";

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
const images = () => (tree: Node) =>
  walk(tree, (n) => {
    if (n.tagName === "img" && typeof n.properties?.src === "string") {
      const size = localImage(n.properties.src);
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

/** Turns ```visual code blocks into designed diagrams (already validated in readMeta) */
const visuals = () => (tree: Node) =>
  walk(tree, (n) => {
    const code = n.tagName === "pre" ? n.children?.find((c) => c.tagName === "code") : undefined;
    const cls = code?.properties?.className;
    if (code && Array.isArray(cls) && cls.includes("language-visual")) {
      Object.assign(n, visualToHast(parseVisual(textOf(code))));
    }
  });

/** Opens links to other websites in a new tab */
const externalLinks = () => (tree: Node) =>
  walk(tree, (n) => {
    const href = n.tagName === "a" ? n.properties?.href : undefined;
    if (typeof href === "string" && /^https?:\/\//.test(href) && !href.startsWith(site.url)) {
      n.properties = { ...n.properties, target: "_blank", rel: ["noopener", "noreferrer"] };
    }
  });

function fail(file: string, problem: string): never {
  throw new Error(`[blog] content/blog/${file}: ${problem}`);
}

/** Reads and validates a post file from /content/blog */
function readMeta(file: string) {
  return parsePost(file, fs.readFileSync(path.join(DIR, file), "utf8"));
}

/** Validates a post's Markdown source (frontmatter + body); throws a readable error when something is off */
export function parsePost(file: string, raw: string): { meta: PostMeta; body: string } {
  const { data, content } = matter(raw);
  const slug = file.replace(/\.md$/, "");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(file, "file name must be lowercase-words-with-dashes.md");
  // YAML turns unquoted dates into Date objects
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");
  const updated = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : data.updated ? String(data.updated) : undefined;

  if (typeof data.title !== "string" || !data.title.trim()) fail(file, "missing `title`");
  if (typeof data.description !== "string" || !data.description.trim()) fail(file, "missing `description`");
  if (data.description.length > 170) fail(file, `\`description\` is ${data.description.length} characters (max 170)`);
  if (!DATE.test(date)) fail(file, "`date` must be YYYY-MM-DD");
  if (updated && !DATE.test(updated)) fail(file, "`updated` must be YYYY-MM-DD");
  if (!(data.pillar in pillars)) fail(file, `\`pillar\` must be one of: ${Object.keys(pillars).join(", ")}`);
  if (data.service !== undefined && !(typeof data.service === "string" && data.service.startsWith("/services"))) {
    fail(file, "`service` must be a link starting with /services");
  }
  if (data.tags !== undefined && !(Array.isArray(data.tags) && data.tags.every((t) => typeof t === "string"))) {
    fail(file, "`tags` must be a list of words");
  }

  let cover: PostMeta["cover"] = null;
  if (data.cover !== undefined) {
    const size = typeof data.cover === "string" ? localImage(data.cover) : null;
    if (!size) fail(file, `\`cover\` "${data.cover}" must be an image inside /public/images that exists`);
    if (typeof data.coverAlt !== "string" || !data.coverAlt.trim()) fail(file, "`coverAlt` (what the cover image shows) is required with `cover`");
    cover = { src: data.cover, alt: data.coverAlt.trim(), ...size };
  }

  // Images inside the post must have a description and exist in /public/images
  for (const [, alt, src] of content.matchAll(/!\[([^\]]*)\]\(\s*<?([^\s)>]+)>?(?:\s+"[^"]*")?\s*\)/g)) {
    if (!alt.trim()) fail(file, `image ${src} needs a description: ![what it shows](${src})`);
    if (!localImage(src)) fail(file, `image ${src} not found — put it in /public/images and link it as /images/...`);
  }

  let scene: PostMeta["scene"] | null = null;
  if (data.coverScene !== undefined) {
    try {
      scene = checkScene(data.coverScene);
    } catch (e) {
      fail(file, (e as Error).message);
    }
  }

  // Designed visuals must be valid
  for (const [, json] of content.matchAll(/```visual[^\S\n]*\n([\s\S]*?)```/g)) {
    try {
      parseVisual(json);
    } catch (e) {
      fail(file, (e as Error).message);
    }
  }

  // AI drafts leave "[Vinod: …]" notes where a personal detail is needed — never publish one unfilled
  if (data.draft !== true && /\[Vinod:/i.test(content)) {
    fail(file, "still has a [Vinod: …] note — fill it in or remove it before publishing (or keep `draft: true`)");
  }

  const pillar = data.pillar as Pillar;
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    body: content,
    meta: {
      slug,
      title: data.title.trim(),
      description: data.description.trim(),
      date,
      updated,
      pillar,
      tags: (data.tags as string[] | undefined) ?? [],
      service: (data.service as string | undefined) ?? pillars[pillar].service,
      cover,
      scene: scene ?? defaultScenes[pillar],
      aiAssisted: data.aiAssisted !== false,
      reviewed: data.reviewed !== false,
      draft: data.draft === true,
      readingMinutes: Math.max(1, Math.round(words / 220)),
    },
  };
}

let cache: { meta: PostMeta; body: string }[] | null = null;

function load() {
  // cached for the build; re-read on every request in `next dev` so edits show up immediately
  if (cache && !showDrafts) return cache;
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  } catch {
    // content folder not bundled with this server function — behave as "no posts"
    return (cache = []);
  }
  cache = files
    .map(readMeta)
    .filter((p) => showDrafts || !p.meta.draft)
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date) || a.meta.slug.localeCompare(b.meta.slug));
  return cache;
}

/** Published posts, newest first (drafts too during `next dev`) */
export function getPosts(): PostMeta[] {
  return load().map((p) => p.meta);
}

export async function getPost(slug: string): Promise<Post | null> {
  const entry = load().find((p) => p.meta.slug === slug);
  return entry ? renderPost(entry) : null;
}

/** Turns a parsed post into HTML (+ its h2 headings for the "On this page" nav) */
export async function renderPost(entry: { meta: PostMeta; body: string }): Promise<Post> {
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
    .use(images)
    .use(externalLinks)
    .use(rehypeStringify)
    .process(entry.body);
  return { ...entry.meta, html: String(file), headings };
}

