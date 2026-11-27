import type { GlobalConfig } from "payload";
import { revalidateSite } from "../cms/revalidate.ts";
import { icon, lines, para, text } from "../cms/fields.ts";

/** Home page sections (the AI workflow also appears on the Experience page) */
export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home page",
  admin: { group: "Pages" },
  hooks: { afterChange: [({ doc, context }) => revalidateSite(context).then(() => doc)] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Stats",
          fields: [
            {
              name: "stats",
              label: "Stats",
              type: "array",
              admin: { description: "The first one (experience) is shown on the home page's experience card." },
              fields: [{ type: "row", fields: [text("label", "Label"), text("value", "Value")] }],
            },
          ],
        },
        {
          label: "Services",
          fields: [
            {
              name: "featuredServices",
              label: "Featured services",
              type: "array",
              admin: { description: "The four service cards on the home page." },
              fields: [
                text("title", "Title"),
                para("text", "Text"),
                lines("points", "Points"),
                {
                  type: "row",
                  fields: [
                    text("tag", "Tag"),
                    text("href", "Link", "e.g. /services#service-1"),
                    icon(),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Problems",
          fields: [
            {
              name: "problems",
              label: "Problems I solve",
              type: "array",
              fields: [text("title", "Title"), para("text", "Text")],
            },
          ],
        },
        {
          label: "AI workflow",
          fields: [
            {
              name: "aiWorkflow",
              label: "AI-assisted workflow",
              type: "group",
              admin: { description: "Shown on the home and experience pages." },
              fields: [
                lines("tools", "Tools"),
                {
                  name: "points",
                  label: "Steps",
                  type: "array",
                  fields: [text("title", "Title"), para("text", "Text")],
                },
                text("closing", "Closing line"),
              ],
            },
          ],
        },
      ],
    },
  ],
};
