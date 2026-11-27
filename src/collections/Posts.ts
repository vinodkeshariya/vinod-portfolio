import { type CollectionBeforeChangeHook, type CollectionConfig, ValidationError } from "payload";
import { afterChange, afterDelete } from "../cms/revalidate.ts";
import { lines } from "../cms/fields.ts";
import { imageLinks, mediaFilename, postProblems } from "../lib/blog-check.ts";
import { pillars, SCENES } from "../lib/blog-meta.ts";
import { REVIEW_DAYS, reviewPath } from "../lib/review-link.ts";

/** Runs the blog's content checks whenever a post is published (drafts can be saved half-finished) */
const checkPost: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (data._status !== "published") return data;
  const names = imageLinks(String(data.content ?? ""))
    .map((i) => mediaFilename(i.src))
    .filter((n): n is string => Boolean(n));
  const found = names.length
    ? await req.payload.find({ collection: "media", where: { filename: { in: names } }, limit: names.length, depth: 0, req })
    : { docs: [] };
  const problems = postProblems(data, new Set(found.docs.map((d) => d.filename ?? "")), true);
  if (problems.length) {
    throw new ValidationError({ collection: "posts", errors: problems.map((p) => ({ path: p.field, message: p.message })) });
  }
  return data;
};

/** Blog articles. Writing: Markdown, with ```visual blocks for diagrams (see src/lib/blog-visuals.ts). */
export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Blog post", plural: "Blog posts" },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: "-date",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "pillar", "date", "_status"],
    description: "Only published posts appear on the site. Weekly AI drafts arrive here for your approval.",
    // "Preview" button: the post exactly as it will look, with Publish / Don't publish buttons
    preview: (doc) => {
      const secret = process.env.BLOG_REVIEW_SECRET;
      const id = Number(doc?.id);
      if (!secret || !id) return null;
      return reviewPath(id, Math.floor(Date.now() / 1000) + REVIEW_DAYS * 86_400, secret);
    },
  },
  hooks: { beforeChange: [checkPost], afterChange: [afterChange], afterDelete: [afterDelete] },
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      maxLength: 170,
      admin: { description: "1–2 sentences for Google and social cards, max 170 characters." },
    },
    {
      name: "content",
      label: "Post (Markdown)",
      type: "textarea",
      required: true,
      admin: {
        rows: 28,
        description:
          "## Heading, ### Sub-heading, **bold**, - bullet, [link](/contact). Images: upload to Media, then ![what it shows](image URL \"optional caption\"). Diagrams: a ```visual block (steps / compare / checklist).",
      },
    },
    {
      name: "reviewNotes",
      label: "What the checks flagged",
      type: "textarea",
      admin: {
        readOnly: true,
        description: "From the weekly AI writer — read these parts carefully before publishing.",
        condition: (data) => Boolean(data?.reviewNotes),
      },
    },
    {
      type: "collapsible",
      label: "Cover",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "cover",
          label: "Cover image (optional)",
          type: "upload",
          relationTo: "media",
          admin: { description: "Leave empty for the branded cover drawn from the illustration below." },
        },
        {
          name: "coverScene",
          label: "Cover illustration",
          type: "group",
          admin: { description: "Leave the kind empty to use the category's default illustration." },
          fields: [
            {
              name: "kind",
              label: "Kind",
              type: "select",
              options: Object.entries(SCENES).map(([value, s]) => ({ label: `${value} — ${s.guide}`, value })),
            },
            lines("labels", "Labels", "The short texts drawn in the illustration, one per line, in the order the kind describes."),
          ],
        },
      ],
    },
    {
      name: "slug",
      label: "URL slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { position: "sidebar", description: "/blog/<slug> — lowercase words with dashes." },
    },
    {
      name: "date",
      label: "Publish date",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" } },
    },
    {
      name: "updated",
      label: "Updated on",
      type: "date",
      admin: { position: "sidebar", description: "When the post was meaningfully changed.", date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" } },
    },
    {
      name: "pillar",
      label: "Category",
      type: "select",
      required: true,
      options: Object.entries(pillars).map(([value, p]) => ({ label: p.label, value })),
      admin: { position: "sidebar" },
    },
    { name: "tags", label: "Tags", type: "textarea", admin: { position: "sidebar", rows: 4, description: "Short keywords, one per line." } },
    {
      name: "service",
      label: "Related service link",
      type: "text",
      admin: { position: "sidebar", description: "e.g. /services#service-5 — empty = the category's service." },
    },
    {
      name: "aiAssisted",
      label: "Show “written with AI assistance” note",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
    {
      name: "reviewed",
      label: "Reviewed and edited by me",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar", description: "Off for AI posts published without review." },
    },
    {
      name: "source",
      type: "select",
      defaultValue: "manual",
      options: [
        { label: "Written here", value: "manual" },
        { label: "Weekly AI writer", value: "autopost" },
      ],
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};
