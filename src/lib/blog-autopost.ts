import "server-only";
import { getPosts } from "./blog";
import { postProblems } from "./blog-check";
import { approvalLink, dateIN, emailHtml, sendMail } from "./blog-email";
import { checkScene, pillars, type Pillar } from "./blog-meta";
import { getContent } from "./content";
import { siteUrl } from "./data";
import { getPayloadClient } from "./payload";

/**
 * Server side of the weekly blog auto-post (scripts/blog/autopost.mjs runs in a GitHub Action and talks to
 * /api/blog/autopost). The site supplies the facts the writer may use, stores the finished post in the CMS
 * as a draft (or publishes it in auto-publish mode) and emails Vinod.
 */

/** Everything the writer and the fact-checker may use, built from the CMS content */
export async function writerContext() {
  const [c, posts] = await Promise.all([getContent(), getPosts()]);
  const payload = await getPayloadClient();
  const all = await payload.find({ collection: "posts", draft: true, depth: 0, pagination: false, select: { slug: true, title: true, content: true, _status: true } });
  const serviceLinks = c.services.map((s, i) => ({ link: `/services#service-${i + 1}`, title: s.title }));

  const facts = {
    person: {
      name: c.site.name,
      role: c.site.role,
      location: c.site.location,
      languages: c.site.languages,
      availability: c.site.availability,
      responseTime: "usually replies within 0–4 hours",
      currentJob: { role: c.experience.role, company: c.experience.company, period: c.experience.period, summary: c.experience.summary, work: c.experience.points },
      experienceSummary: "3+ years in web development",
    },
    certifications: c.certifications.map((x) => `${x.title} — ${x.issuer}, ${x.date}`),
    aiTools: c.aiWorkflow.tools,
    aiWorkflow: c.aiWorkflow.points,
    aiWorkflowPrinciple: c.aiWorkflow.closing,
    developmentApproach: c.approach,
    howProjectsRun: c.process,
    principles: c.principles.map((p) => `${p.title}: ${p.text}`),
    focusAreas: c.aboutFocus.map((f) => `${f.title}: ${f.text}`),
    skills: c.skillCards.map((s) => ({ group: s.title, items: s.items })),
    services: c.services.map((s, i) => ({ link: `/services#service-${i + 1}`, title: s.title, summary: s.body, includes: s.points, tech: s.tags })),
    faqs: c.faqs,
    conceptProjects: c.projects.map((p) => ({
      link: `/projects/${p.slug}`,
      title: p.title,
      note: `${p.client} — a concept project built to demonstrate skills, NOT real client work`,
      summary: p.summary,
      tech: p.tech,
    })),
  };

  const allowedLinks = [
    ...serviceLinks.map((s) => `${s.link} (${s.title})`),
    "/services (all services)",
    "/contact (contact form — use in the closing)",
    "/about (about Vinod)",
    "/experience (experience and skills)",
    "/hire-me (hire Vinod)",
    "/blog (all articles)",
    ...posts.map((p) => `/blog/${p.slug} (article: ${p.title})`),
    ...c.projects.map((p) => `/projects/${p.slug} (concept project: ${p.title})`),
  ];

  const latest = all.docs.find((d) => d._status === "published" && d.slug === posts[0]?.slug);
  return {
    site: { name: c.site.name, role: c.site.role, location: c.site.location, url: siteUrl },
    facts,
    allowedLinks,
    serviceLinks,
    conceptBrands: c.projects.map((p) => p.client.split(" — ")[0].trim()).filter(Boolean),
    published: posts.map((p) => ({ slug: p.slug, title: p.title, description: p.description })),
    slugs: all.docs.map((d) => d.slug),
    styleExample: latest?.content ?? "",
  };
}

/** "2026-11-30" in India time */
const todayIN = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);

function slugify(title: string, taken: Set<string>) {
  const base =
    title
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .slice(0, 9)
      .join("-") || "post";
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

export type NewPost = {
  pillar: string;
  title: string;
  description: string;
  tags: string[];
  service: string;
  scene: { kind: string; labels: string[] };
  content: string;
};

/**
 * Saves the writer's post: a draft waiting for approval, or — in auto-publish mode with every check passed —
 * a published post. Then emails Vinod (approval link / "now live").
 */
export async function savePost({ post, issues, autoPublish }: { post: NewPost; issues: string[]; autoPublish: boolean }) {
  if (!(post.pillar in pillars)) throw new Error(`Unknown category "${post.pillar}"`);
  const scene = checkScene(post.scene);
  const payload = await getPayloadClient();
  const { site } = await getContent();

  const existing = await payload.find({ collection: "posts", draft: true, depth: 0, pagination: false, select: { slug: true } });
  const slug = slugify(post.title, new Set(existing.docs.map((d) => d.slug)));
  const publish = autoPublish && issues.length === 0;

  const data = {
    title: post.title.trim(),
    slug,
    description: post.description.trim(),
    content: post.content,
    pillar: post.pillar as Pillar,
    tags: post.tags.map((t) => t.trim()).filter(Boolean).slice(0, 6).join("\n"),
    service: post.service,
    coverScene: { kind: scene.kind, labels: scene.labels.join("\n") },
    date: `${todayIN()}T06:30:00.000Z`, // noon in India
    aiAssisted: true,
    // approval mode: it only goes live after Vinod approves it; auto-publish mode: not reviewed
    reviewed: !autoPublish,
    source: "autopost" as const,
    reviewNotes: issues.join("\n"),
  };

  const problems = postProblems(data, new Set(), publish);
  if (problems.length) throw new Error(`The post can't be saved: ${problems.map((p) => `${p.field}: ${p.message}`).join("; ")}`);

  const doc = await payload.create({ collection: "posts", data: { ...data, _status: publish ? "published" : "draft" }, draft: !publish });
  const url = `${siteUrl}/blog/${slug}`;

  if (publish) {
    const blocks = ["This week's post passed every check and is live:", url, "Please give it a quick read when you have a moment."];
    await sendMail({
      to: site.email,
      subject: `New blog post live: ${data.title}`,
      text: blocks.join("\n"),
      html: emailHtml({ label: "Blog post published", heading: data.title, blocks, button: { label: "Read the post", url } }),
    });
    return { id: doc.id, slug, url, status: "published" as const };
  }

  const link = approvalLink(doc.id);
  const checks = issues.length ? "The checks flagged a few things — please read these parts carefully:" : "All checks passed: content rules and the AI fact-check against your website.";
  const blocks = ["This week's post is written and waiting for you. It is NOT live yet.", data.description, checks, ...(issues.length ? [issues] : [])];
  await sendMail({
    to: site.email,
    subject: `Approve this week's blog post: ${data.title}`,
    text: [
      ...blocks.flat(),
      "",
      link ? `Preview and publish: ${link.url}` : "(Approval link unavailable — BLOG_REVIEW_SECRET is not set.)",
      link ? `The link expires on ${dateIN(link.expires)}. Nothing is published without you. You can also edit the draft in the admin: ${siteUrl}/admin/collections/posts/${doc.id}` : "",
    ].join("\n"),
    html: emailHtml({
      label: "Blog post ready for approval",
      heading: data.title,
      blocks,
      button: link && { label: "Preview & publish", url: link.url },
      footnote: link && `Opens a private preview on your site with Publish / Don't publish buttons. Expires on ${dateIN(link.expires)}.`,
    }),
  });
  return { id: doc.id, slug, url, status: "approval" as const };
}

/** Emails Vinod when no post could be prepared this week */
export async function notifyProblem({ result, issues, runUrl }: { result: "none" | "failed"; issues: string[]; runUrl?: string }) {
  const { site } = await getContent();
  if (result === "none") {
    const blocks = ["No post was written this week because the topic list (content/blog/_topics.md) is empty.", "Add a few topics — or ask Claude to suggest some — and next week's run will pick them up."];
    return sendMail({ to: site.email, subject: "Blog topic list is empty", text: blocks.join("\n"), html: emailHtml({ label: "Weekly blog", heading: "Add new blog topics", blocks }) });
  }
  const blocks: (string | string[])[] = ["This week's post could not be prepared, so nothing was sent for approval or published.", issues.length ? issues : ["Unknown error."], "It will try again next week."];
  return sendMail({
    to: site.email,
    subject: "Blog auto-post: nothing this week",
    text: [...blocks.flat(), "", runUrl ? `Details: ${runUrl}` : ""].join("\n"),
    html: emailHtml({ label: "Weekly blog", heading: "No post this week", blocks, button: runUrl ? { label: "See details", url: runUrl } : null }),
  });
}

/**
 * Daily check of auto-written drafts waiting for approval:
 *   - after 3 days: one reminder email with a fresh approval link
 *   - after 7 days: the draft is removed (not published) and Vinod is told
 */
export async function runReminders() {
  const payload = await getPayloadClient();
  const { site } = await getContent();
  const { docs } = await payload.find({
    collection: "posts",
    where: { and: [{ source: { equals: "autopost" } }, { _status: { equals: "draft" } }] },
    depth: 0,
    pagination: false,
    select: { title: true, createdAt: true, _status: true },
  });
  const DAY = 86_400_000;
  const done: string[] = [];

  for (const d of docs) {
    const created = Date.parse(d.createdAt);
    const age = (Date.now() - created) / DAY;
    if (age >= 7) {
      await payload.delete({ collection: "posts", id: d.id });
      const blocks = [`"${d.title}" waited 7 days without approval, so it was removed and not published.`, "Nothing to do — next week's post will arrive as usual."];
      await sendMail({ to: site.email, subject: `Blog draft expired: ${d.title}`, text: blocks.join("\n"), html: emailHtml({ label: "Weekly blog", heading: "Draft expired", blocks }) });
      done.push(`removed ${d.id}`);
    } else if (age >= 3 && age < 4) {
      const link = approvalLink(d.id, created);
      if (!link) continue;
      const blocks = [`"${d.title}" is still waiting for your approval. It will not go live unless you publish it.`];
      await sendMail({
        to: site.email,
        subject: `Reminder: approve your blog post — ${d.title}`,
        text: [...blocks, `Preview and publish: ${link.url}`, `The link expires on ${dateIN(link.expires)}.`].join("\n"),
        html: emailHtml({
          label: "Reminder",
          heading: d.title,
          blocks,
          button: { label: "Preview & publish", url: link.url },
          footnote: `The draft is removed on ${dateIN(link.expires)} if it isn't published.`,
        }),
      });
      done.push(`reminded ${d.id}`);
    }
  }
  return { waiting: docs.length, done };
}

/** True when the request carries the shared secret (Authorization: Bearer <BLOG_REVIEW_SECRET>) */
export function fromBlogBot(req: Request) {
  const secret = process.env.BLOG_REVIEW_SECRET;
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!secret || given.length !== secret.length) return false;
  let diff = 0;
  for (let i = 0; i < secret.length; i++) diff |= secret.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}
