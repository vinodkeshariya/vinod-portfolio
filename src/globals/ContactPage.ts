import type { GlobalConfig } from "payload";
import { revalidateSite } from "../cms/revalidate.ts";
import { lines } from "../cms/fields.ts";
import { contactTexts } from "../cms/texts.ts";

/** Contact page list and the contact form's choices */
export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact & form",
  admin: { group: "Pages" },
  hooks: { afterChange: [({ doc, context }) => revalidateSite(context).then(() => doc)] },
  fields: [
    {
      type: "tabs",
      tabs: [
        { label: "Page texts", fields: [contactTexts] },
        {
          label: "Lists",
          fields: [
            lines("helpWith", "“What can I help you build?” list"),
            lines("projectTypes", "Contact form: project types"),
            lines("budgets", "Contact form: budgets"),
          ],
        },
      ],
    },
  ],
};
