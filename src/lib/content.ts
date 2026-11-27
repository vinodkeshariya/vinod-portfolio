import "server-only";
import { unstable_cache } from "next/cache";
import { CMS_TAG } from "@/cms/revalidate";
import type { Media } from "@/payload-types";
import { toList } from "./blog-check";
import { nav, siteUrl, type Content, type IconName, type PageTexts, type Project, type ProjectFilter } from "./data";
import { cmsCacheKey } from "./cache-key";
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
  const [s, home, about, svc, contact, projects, faqs, work, hireMe, blog] = await Promise.all([
    payload.findGlobal({ slug: "site-settings", depth: 1 }),
    payload.findGlobal({ slug: "home-page", depth: 1 }),
    payload.findGlobal({ slug: "about-page", depth: 0 }),
    payload.findGlobal({ slug: "services-page", depth: 1 }),
    payload.findGlobal({ slug: "contact-page", depth: 0 }),
    payload.find({ collection: "projects", sort: "_order", depth: 1, pagination: false }),
    payload.find({ collection: "faqs", sort: "_order", depth: 0, pagination: false }),
    payload.findGlobal({ slug: "work-page", depth: 0 }),
    payload.findGlobal({ slug: "hire-me-page", depth: 0 }),
    payload.findGlobal({ slug: "blog-page", depth: 0 }),
  ]);

  const texts = {
    home: home.texts,
    about: about.aboutTexts,
    experience: about.experienceTexts,
    services: svc.texts,
    work: work.texts,
    hireMe: hireMe.texts,
    contact: contact.texts,
    blog: blog.texts,
    layout: s.layout,
  } as PageTexts;
  const menuLabels = (texts.layout?.menu ?? {}) as Record<string, string | null>;
  const menuKey: Record<string, string> = { "/": "home", "/about": "about", "/services": "services", "/projects": "work", "/experience": "experience", "/blog": "blog", "/contact": "contact" };

  return {
    texts,
    vars: { name: str(s.name), role: str(s.role), email: str(s.email), company: str(about.experience?.company) },
    menu: nav.map((n) => ({ href: n.href, label: menuLabels[menuKey[n.href]] || n.label })),
    showcase: (home.texts?.hero?.showcase ?? []).map((x) => ({ src: mediaUrl(x.image), alt: x.alt || mediaAlt(x.image) })),
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

export const getContent = unstable_cache(load, ["cms-content", ...cmsCacheKey], {
  tags: [CMS_TAG],
});
