import type { CollectionConfig } from "payload";
import { afterChange, afterDelete } from "../cms/revalidate.ts";
import { image, lines, para, text } from "../cms/fields.ts";
import { projectFilters } from "../lib/data.ts";

/** Portfolio projects — the Work page, the case-study pages and the home page's featured work */
export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Projects" },
  orderable: true, // drag rows in the list to change the order on the Work page
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "year", "slug"],
    description: "Drag to reorder. The order here is the order on the Work page.",
  },
  hooks: { afterChange: [afterChange], afterDelete: [afterDelete] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Card",
          fields: [
            text("title", "Title"),
            {
              name: "slug",
              label: "URL slug",
              type: "text",
              required: true,
              unique: true,
              index: true,
              admin: { description: "The page address: /projects/<slug>. Lowercase words with dashes." },
              validate: (v: unknown) => (typeof v === "string" && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v)) || "Use lowercase words with dashes, e.g. my-project",
            },
            {
              type: "row",
              fields: [text("category", "Category"), text("year", "Year")],
            },
            text("client", "Client", "For concept work, say so — e.g. “Aurelle — concept brand”."),
            para("summary", "Summary", "Short text on the project card."),
            image("cover", "Cover image", true, "Homepage screenshot shown on the card and at the top of the case study."),
            {
              name: "tint",
              label: "Background colour",
              type: "text",
              required: true,
              defaultValue: "#edeae0",
              admin: { description: "Soft colour behind the screenshots, e.g. #edeae0." },
              validate: (v: unknown) => (typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v)) || "Use a colour like #edeae0",
            },
            {
              name: "featured",
              label: "Show on the home page",
              type: "checkbox",
              defaultValue: false,
              admin: { description: "The first two ticked projects appear under “Featured projects”." },
            },
            {
              name: "filters",
              label: "Work page filters",
              type: "select",
              hasMany: true,
              required: true,
              options: projectFilters.filter((f) => f.id !== "all").map((f) => ({ label: f.label, value: f.id })),
            },
          ],
        },
        {
          label: "Case study",
          fields: [
            para("tagline", "Tagline", "One sentence under the case-study title."),
            {
              type: "row",
              fields: [text("role", "My role"), text("stack", "Stack")],
            },
            lines("tags", "Tags", "Shown under the title. One per line."),
            para("overview", "Overview"),
            para("challenge", "Challenge"),
            para("approach", "Approach & solution"),
            lines("features", "Key features"),
            lines("tech", "Technologies"),
            {
              name: "gallery",
              label: "Screenshots",
              type: "array",
              labels: { singular: "Screenshot", plural: "Screenshots" },
              fields: [
                image("image", "Image"),
                {
                  name: "device",
                  label: "Frame",
                  type: "select",
                  required: true,
                  defaultValue: "desktop",
                  options: [
                    { label: "Desktop browser", value: "desktop" },
                    { label: "Mobile phone", value: "mobile" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Call to action",
          fields: [text("ctaTitle", "Heading"), para("ctaText", "Text")],
        },
      ],
    },
  ],
};
