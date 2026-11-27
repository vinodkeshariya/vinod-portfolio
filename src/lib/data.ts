/**
 * Site structure that lives in code: the address, menu, project filters and the shapes of the content.
 * The content itself (texts, projects, services, FAQs, blog…) is edited in the CMS at /admin
 * and read with getContent() from ./content.ts.
 *
 * No runtime imports, so the Payload config can use this file too.
 */
import type { IconName } from "./icons.ts";

export type { IconName } from "./icons.ts";

export const siteUrl = "https://vinodkeshariya.vercel.app";

export const ext = (href: string) =>
  href.startsWith("http") ? ({ target: "_blank", rel: "noopener noreferrer" } as const) : {};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const projectFilters = [
  { id: "all", label: "All" },
  { id: "nextjs", label: "Next.js + Sanity" },
  { id: "migration", label: "Migration" },
  { id: "landing", label: "Landing pages" },
  { id: "wordpress", label: "WordPress" },
  { id: "ecommerce", label: "E-commerce" },
] as const;

/* ------------------------------------------------------------------ */
/* Content shapes (filled from the CMS)                                */
/* ------------------------------------------------------------------ */

export type Site = {
  name: string;
  role: string;
  location: string;
  url: string;
  email: string;
  phone: string;
  /** Download link of the résumé PDF */
  resume: string;
  availability: string;
  hours: string;
  description: string;
  languages: string[];
  /** `upwork` is "#" when no profile is set — see hasUpwork() */
  socials: { linkedin: string; github: string; upwork: string; whatsapp: string };
};

/** True once a real Upwork profile URL has been added */
export const hasUpwork = (site: Site) => site.socials.upwork !== "#";

export type GalleryItem = { src: string; alt: string; device: "desktop" | "mobile" };

export type ProjectFilter = "nextjs" | "migration" | "landing" | "wordpress" | "ecommerce";

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  filters: ProjectFilter[];
  role: string;
  stack: string;
  year: string;
  summary: string;
  tagline: string;
  tags: string[];
  cover: string;
  overview: string;
  challenge: string;
  approach: string;
  features: string[];
  tech: string[];
  gallery: GalleryItem[];
  ctaTitle: string;
  ctaText: string;
  /** Soft background colour behind the device mockups */
  tint: string;
  /** Shown in the home page's "Featured projects" */
  featured: boolean;
};

export type Service = {
  title: string;
  short: string;
  body: string;
  tags: string[];
  icon: IconName;
  image: string;
  imageAlt: string;
  points: string[];
  tagsLabel?: string;
};

type TitleText = { title: string; text: string };

export type Content = {
  site: Site;
  google: { gaId: string; searchConsole: string };
  stats: { label: string; value: string }[];
  problems: TitleText[];
  featuredServices: (TitleText & { points: string[]; tag: string; href: string; icon: IconName })[];
  aiWorkflow: { tools: string[]; points: TitleText[]; closing: string };
  skillCards: { title: string; icon: IconName; items: string[] }[];
  projects: Project[];
  services: Service[];
  approach: string[];
  packages: { name: string; title: string; text: string; points: string[]; price: string; featured: boolean }[];
  process: TitleText[];
  principles: (TitleText & { icon: IconName })[];
  aboutFocus: (TitleText & { icon: IconName })[];
  experience: { role: string; company: string; place: string; period: string; summary: string; points: string[]; tags: string[] };
  certifications: { date: string; issuer: string; title: string; text: string }[];
  faqs: { q: string; a: string }[];
  projectTypes: string[];
  helpWith: string[];
  budgets: string[];
};
