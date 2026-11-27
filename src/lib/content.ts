import "server-only";
import { unstable_cache } from "next/cache";
import { CMS_TAG } from "@/cms/revalidate";
import type { Media } from "@/payload-types";
import { toList } from "./blog-check";
import { siteUrl, type Content, type IconName, type Project, type ProjectFilter } from "./data";
import { getPayloadClient } from "./payload";

/**
 * Everything the pages show, read from the CMS (Payload, /admin) in the same shapes the components use.
 *
 *   const { site, projects, faqs } = await getContent();
 *
 * Cached and tagged CMS_TAG: pages stay static and fast, and any save in the admin refreshes them
 * (see src/cms/revalidate.ts). The cache key includes the deployment so a new deploy never serves
 * content cached by an older one.
 */

type MaybeMedia = number | Media | null | undefined;

/** Public URL of an uploaded file ("" when missing) */
export const mediaUrl = (m: MaybeMedia) => (m && typeof m === "object" && m.url) || "";
const mediaAlt = (m: MaybeMedia) => (m && typeof m === "object" && m.alt) || "";

/** Download link for a file: Vercel Blob serves it as an attachment with ?download=1 */
const downloadUrl = (m: MaybeMedia) => {
  const url = mediaUrl(m);
  return url && /\.public\.blob\.vercel-storage\.com\//.test(url) ? `${url}?download=1` : url;
};

const str = (v: unknown) => (typeof v === "string" ? v : "");
const icon = (v: unknown) => (typeof v === "string" ? v : "check") as IconName;

async function load(): Promise<Content> {
  const payload = await getPayloadClient();
  const [s, home, about, svc, contact, projects, faqs] = await Promise.all([
    payload.findGlobal({ slug: "site-settings", depth: 1 }),
    payload.findGlobal({ slug: "home-page", depth: 0 }),
    payload.findGlobal({ slug: "about-page", depth: 0 }),
    payload.findGlobal({ slug: "services-page", depth: 1 }),
    payload.findGlobal({ slug: "contact-page", depth: 0 }),
    payload.find({ collection: "projects", sort: "_order", depth: 1, pagination: false }),
    payload.find({ collection: "faqs", sort: "_order", depth: 0, pagination: false }),
  ]);

  return {
    site: {
      name: str(s.name),
      role: str(s.role),
      location: str(s.location),
      url: siteUrl,
      email: str(s.email),
      phone: str(s.phone),
      resume: downloadUrl(s.resume),
      availability: str(s.availability),
      hours: str(s.hours),
      description: str(s.description),
      languages: toList(s.languages),
      socials: { linkedin: str(s.linkedin), github: str(s.github), upwork: str(s.upwork).trim() || "#", whatsapp: str(s.whatsapp) },
    },
    google: { gaId: str(s.gaId).trim(), searchConsole: str(s.searchConsole).trim() },

    stats: (home.stats ?? []).map((x) => ({ label: x.label, value: x.value })),
    problems: (home.problems ?? []).map((x) => ({ title: x.title, text: x.text })),
    featuredServices: (home.featuredServices ?? []).map((x) => ({
      title: x.title,
      text: x.text,
      points: toList(x.points),
      tag: x.tag,
      href: x.href,
      icon: icon(x.icon),
    })),
    aiWorkflow: {
      tools: toList(home.aiWorkflow?.tools),
      points: (home.aiWorkflow?.points ?? []).map((x) => ({ title: x.title, text: x.text })),
      closing: str(home.aiWorkflow?.closing),
    },

    experience: {
      role: str(about.experience?.role),
      company: str(about.experience?.company),
      place: str(about.experience?.place),
      period: str(about.experience?.period),
      summary: str(about.experience?.summary),
      points: toList(about.experience?.points),
      tags: toList(about.experience?.tags),
    },
    certifications: (about.certifications ?? []).map((x) => ({ date: x.date, issuer: x.issuer, title: x.title, text: x.text })),
    skillCards: (about.skillCards ?? []).map((x) => ({ title: x.title, icon: icon(x.icon), items: toList(x.items) })),
    aboutFocus: (about.aboutFocus ?? []).map((x) => ({ title: x.title, text: x.text, icon: icon(x.icon) })),
    principles: (about.principles ?? []).map((x) => ({ title: x.title, text: x.text, icon: icon(x.icon) })),

    services: (svc.services ?? []).map((x) => ({
      title: x.title,
      short: x.short,
      body: x.body,
      points: toList(x.points),
      tags: toList(x.tags),
      ...(x.tagsLabel ? { tagsLabel: x.tagsLabel } : {}),
      icon: icon(x.icon),
      image: mediaUrl(x.image),
      imageAlt: x.imageAlt || mediaAlt(x.image),
    })),
    packages: (svc.packages ?? []).map((x) => ({
      name: x.name,
      title: x.title,
      text: x.text,
      points: toList(x.points),
      price: x.price,
      featured: Boolean(x.featured),
    })),
    process: (svc.process ?? []).map((x) => ({ title: x.title, text: x.text })),
    approach: toList(svc.approach),

    helpWith: toList(contact.helpWith),
    projectTypes: toList(contact.projectTypes),
    budgets: toList(contact.budgets),

    faqs: faqs.docs.map((f) => ({ q: f.question, a: f.answer })),

    projects: projects.docs.map(
      (p): Project => ({
        slug: p.slug,
        title: p.title,
        client: p.client,
        category: p.category,
        filters: (p.filters ?? []) as ProjectFilter[],
        role: p.role,
        stack: p.stack,
        year: p.year,
        summary: p.summary,
        tagline: p.tagline,
        tags: toList(p.tags),
        cover: mediaUrl(p.cover),
        overview: p.overview,
        challenge: p.challenge,
        approach: p.approach,
        features: toList(p.features),
        tech: toList(p.tech),
        gallery: (p.gallery ?? [])
          .filter((g) => mediaUrl(g.image))
          .map((g) => ({ src: mediaUrl(g.image), alt: mediaAlt(g.image), device: g.device })),
        ctaTitle: p.ctaTitle,
        ctaText: p.ctaText,
        tint: p.tint,
        featured: Boolean(p.featured),
      }),
    ),
  };
}

export const getContent = unstable_cache(load, ["cms-content", process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local"], {
  tags: [CMS_TAG],
});
