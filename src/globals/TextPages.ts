import type { GlobalConfig } from "payload";
import { revalidateSite } from "../cms/revalidate.ts";
import { blogTexts, hireMeTexts, workTexts } from "../cms/texts.ts";

/** Pages whose content lives elsewhere (projects, posts, services) — only their texts are edited here */
const textPage = (slug: string, label: string, texts: GlobalConfig["fields"][number], description: string): GlobalConfig => ({
  slug,
  label,
  admin: { group: "Pages", description },
  hooks: { afterChange: [({ doc, context }) => revalidateSite(context).then(() => doc)] },
  fields: [texts],
});

export const WorkPage = textPage("work-page", "Work & project pages", workTexts, "Texts of the Work page and of every project page. The projects themselves are under Content → Projects.");
export const HireMePage = textPage("hire-me-page", "Hire me", hireMeTexts, "Texts of the Hire me page. Its process and service list come from Services.");
export const BlogPage = textPage("blog-page", "Blog", blogTexts, "Texts of the blog page and of every post page. The posts themselves are under Content → Blog posts.");
