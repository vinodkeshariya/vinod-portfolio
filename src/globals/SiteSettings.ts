import type { GlobalConfig } from "payload";
import { revalidateSite } from "../cms/revalidate.ts";
import { image, lines, para, text } from "../cms/fields.ts";

/** Name, role, contact details and links used across the whole site */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  admin: {
    group: "Settings",
    description: "Your details — shown in the header, footer, contact page, structured data and the site assistant.",
  },
  hooks: { afterChange: [({ doc, context }) => revalidateSite(context).then(() => doc)] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Profile",
          fields: [
            text("name", "Name"),
            text("role", "Role", "e.g. AI-Powered Full-Stack Developer — footer, page titles, structured data."),
            text("location", "Location"),
            {
              type: "row",
              fields: [text("availability", "Availability"), text("hours", "Hours per week")],
            },
            para("description", "Short bio", "Used for Google, social cards and the about page's structured data."),
            lines("languages", "Languages", "One per line, e.g. “English — Fluent”."),
            image("resume", "Résumé (PDF)", true, "The file behind every “Download résumé” button."),
          ],
        },
        {
          label: "Contact & social",
          fields: [
            { name: "email", label: "Email", type: "email", required: true },
            text("phone", "Phone"),
            text("whatsapp", "WhatsApp link", "e.g. https://wa.me/919265121783"),
            text("linkedin", "LinkedIn URL"),
            text("github", "GitHub URL"),
            {
              name: "upwork",
              label: "Upwork profile URL",
              type: "text",
              admin: { description: "Leave empty to hide the “Hire me on Upwork” buttons." },
            },
          ],
        },
        {
          label: "Google",
          fields: [
            {
              name: "gaId",
              label: "Google Analytics ID",
              type: "text",
              admin: { description: "G-XXXXXXXXXX — loads only on the live site. Empty = off." },
            },
            {
              name: "searchConsole",
              label: "Search Console verification code",
              type: "text",
              admin: { description: "The content value of the “HTML tag” method. Empty = off." },
            },
          ],
        },
      ],
    },
  ],
};
