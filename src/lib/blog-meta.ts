/**
 * Blog types and helpers that are safe to use in the browser (no file-system access).
 * Reading posts from disk lives in ./blog.ts.
 */

export const pillars = {
  "ai-for-business": { label: "AI for business", service: "/services#service-1", serviceLabel: "AI Integration & Development" },
  "ai-development": { label: "AI-powered development", service: "/services#service-2", serviceLabel: "Claude Code & AI-Assisted Development" },
  "web-development": { label: "Web development", service: "/services#service-3", serviceLabel: "Next.js & React Development" },
  "honest-takes": { label: "Honest takes", service: "/services", serviceLabel: "All services" },
} as const;

export type Pillar = keyof typeof pillars;

/**
 * Cover scenes: each post's cover / hero illustration is one of these, filled with the post's own short labels.
 * `labels` = the maximum length of each label, in order (the count is fixed). `guide` tells the writer what goes where.
 * Drawn in src/lib/blog-scene-art.tsx.
 */
export const SCENES = {
  chat: { labels: [40, 72], guide: "an AI chat on a website: [a visitor's question, the assistant's short answer]" },
  code: { labels: [22, 26], guide: "a code editor with a review badge: [file name like ChatWidget.tsx, short review note]" },
  browser: { labels: [30, 14, 14, 14], guide: "a website layout: [page headline, three section names]" },
  search: { labels: [34, 40, 32, 32], guide: "AI search on a website: [search query, short AI answer, two result titles]" },
  migration: { labels: [16, 16, 16], guide: "moving a site from WordPress to Next.js + Sanity: [three things that move]" },
  cms: { labels: [30, 14, 14, 14], guide: "a CMS editor (Sanity Studio): [document title, three field names]" },
  checklist: { labels: [26, 26, 26, 26], guide: "a checklist: [four short to-dos]" },
  steps: { labels: [18, 18, 18, 18], guide: "a process: [four short step names]" },
  compare: { labels: [16, 16], guide: "two options side by side: [option A, option B]" },
  shield: { labels: [24, 24, 24], guide: "security / quality checks: [three short checks]" },
  quote: { labels: [80], guide: "a key takeaway: [one short sentence]" },
} as const;

export type SceneKind = keyof typeof SCENES;
export type Scene = { kind: SceneKind; labels: string[] };

/** Scene used when a post doesn't set one */
export const defaultScenes: Record<Pillar, Scene> = {
  "ai-for-business": { kind: "chat", labels: ["Can I update my booking online?", "Yes — open “My bookings”, pick a new date and save it."] },
  "ai-development": { kind: "code", labels: ["ProjectPage.tsx", "Reviewed & tested"] },
  "web-development": { kind: "browser", labels: ["Fast, easy-to-edit websites", "Services", "Blog", "Contact"] },
  "honest-takes": { kind: "quote", labels: ["AI accelerates the process. Engineering judgment ensures the quality."] },
};

/** Validates a scene from frontmatter / the writer; throws a readable message */
export function checkScene(v: unknown): Scene {
  const s = v as { kind?: unknown; labels?: unknown };
  if (!s || typeof s.kind !== "string" || !(s.kind in SCENES)) throw new Error(`coverScene \`kind\` must be one of: ${Object.keys(SCENES).join(", ")}`);
  const spec = SCENES[s.kind as SceneKind].labels;
  const labels = s.labels;
  if (!Array.isArray(labels) || labels.length !== spec.length) throw new Error(`coverScene "${s.kind}" needs exactly ${spec.length} labels`);
  labels.forEach((l, i) => {
    if (typeof l !== "string" || !l.trim()) throw new Error(`coverScene label ${i + 1} is empty`);
    if (l.length > spec[i]) throw new Error(`coverScene label ${i + 1} is ${l.length} characters (max ${spec[i]})`);
  });
  return { kind: s.kind as SceneKind, labels: labels as string[] };
}

export type CoverImage = { src: string; alt: string; width: number; height: number };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  pillar: Pillar;
  tags: string[];
  service: string;
  /** Uploaded cover image, or null to use the generated branded cover */
  cover: CoverImage | null;
  /** Illustration for the generated cover and hero (the category's default when not set) */
  scene: Scene;
  aiAssisted: boolean;
  /** false for auto-published posts that weren't reviewed before going live */
  reviewed: boolean;
  draft: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & { html: string; headings: { id: string; label: string }[] };

/** The post's cover: its own image, or the generated branded one */
export function coverOf(p: PostMeta): CoverImage {
  return p.cover ?? { src: `/blog/${p.slug}/opengraph-image`, alt: `Cover image: ${p.title}`, width: 1200, height: 630 };
}

/** Keeps a dash on the same line as the word before it, so a title line never starts with "—" */
export const keepDash = (title: string) => title.replace(/ ([—–])/g, " $1");

/** "20 Nov 2026" */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
