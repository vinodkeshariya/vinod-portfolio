import type { GlobalConfig } from "payload";
import { revalidateSite } from "../cms/revalidate.ts";
import { icon, lines, para, text } from "../cms/fields.ts";
import { aboutTexts, experienceTexts } from "../cms/texts.ts";

/** About and Experience pages: work history, certifications, skills and principles */
export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About & experience",
  admin: { group: "Pages" },
  hooks: { afterChange: [({ doc, context }) => revalidateSite(context).then(() => doc)] },
  fields: [
    {
      type: "tabs",
      tabs: [
        { label: "About page texts", fields: [aboutTexts] },
        { label: "Experience page texts", fields: [experienceTexts] },
        {
          label: "Experience",
          fields: [
            {
              name: "experience",
              label: "Current job",
              type: "group",
              admin: { description: "Shown on the home, about and experience pages." },
              fields: [
                { type: "row", fields: [text("role", "Role"), text("company", "Company")] },
                { type: "row", fields: [text("place", "Place"), text("period", "Period", "e.g. June 2023 – Present")] },
                para("summary", "Summary"),
                lines("points", "What I do there"),
                lines("tags", "Technologies"),
              ],
            },
          ],
        },
        {
          label: "Certifications",
          fields: [
            {
              name: "certifications",
              label: "Certifications",
              type: "array",
              fields: [
                { type: "row", fields: [text("title", "Title"), text("issuer", "Issuer"), text("date", "Date", "e.g. February 2025")] },
                para("text", "What it covered"),
              ],
            },
          ],
        },
        {
          label: "Skills",
          fields: [
            {
              name: "skillCards",
              label: "Skill groups",
              type: "array",
              admin: { description: "Experience page skill cards; also used for structured data." },
              fields: [{ type: "row", fields: [text("title", "Title"), icon()] }, lines("items", "Skills")],
            },
          ],
        },
        {
          label: "About cards",
          fields: [
            {
              name: "aboutFocus",
              label: "What I do",
              type: "array",
              fields: [{ type: "row", fields: [text("title", "Title"), icon()] }, para("text", "Text")],
            },
            {
              name: "principles",
              label: "How I work",
              type: "array",
              fields: [{ type: "row", fields: [text("title", "Title"), icon()] }, para("text", "Text")],
            },
          ],
        },
      ],
    },
  ],
};
