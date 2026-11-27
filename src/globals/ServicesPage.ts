import type { GlobalConfig } from "payload";
import { revalidateSite } from "../cms/revalidate.ts";
import { icon, image, lines, para, text } from "../cms/fields.ts";
import { servicesTexts } from "../cms/texts.ts";

/** Services, packages and the project process (the process also appears on the home and hire-me pages) */
export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  label: "Services",
  admin: { group: "Pages" },
  hooks: { afterChange: [({ doc, context }) => revalidateSite(context).then(() => doc)] },
  fields: [
    {
      type: "tabs",
      tabs: [
        { label: "Page texts", fields: [servicesTexts] },
        {
          label: "Services",
          fields: [
            {
              name: "services",
              label: "Services",
              type: "array",
              admin: {
                description:
                  "Keep the order: links like /services#service-1 point to the 1st service, #service-2 to the 2nd… The 7th is shown as a wide card.",
              },
              fields: [
                { type: "row", fields: [text("title", "Title"), icon()] },
                text("short", "Short line", "Used on the hire-me page."),
                para("body", "Description"),
                lines("points", "What's included"),
                { type: "row", fields: [lines("tags", "Tags"), { name: "tagsLabel", label: "Tags heading", type: "text", admin: { description: "Default: Tech" } }] },
                image("image", "Image"),
                { name: "imageAlt", label: "Image description", type: "text", admin: { description: "Empty = the image's own description." } },
              ],
            },
          ],
        },
        {
          label: "Packages",
          fields: [
            {
              name: "packages",
              label: "Packages",
              type: "array",
              fields: [
                { type: "row", fields: [text("name", "Label", "e.g. Most popular"), text("title", "Title"), text("price", "Price line")] },
                para("text", "Text"),
                lines("points", "Points"),
                { name: "featured", label: "Highlight this package", type: "checkbox", defaultValue: false },
              ],
            },
          ],
        },
        {
          label: "Process",
          fields: [
            {
              name: "process",
              label: "How a project runs",
              type: "array",
              admin: { description: "Shown on the home, services and hire-me pages." },
              fields: [text("title", "Title"), para("text", "Text")],
            },
            lines("approach", "Development approach", "The six steps on the services page, one per line."),
          ],
        },
      ],
    },
  ],
};
