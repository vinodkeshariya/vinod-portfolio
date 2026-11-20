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
  aiAssisted: boolean;
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
