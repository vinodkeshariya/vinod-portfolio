import type { Field } from "payload";
import { ICON_NAMES } from "../lib/icons.ts";

/**
 * "Page texts": the headings, intros, cards, button labels and Google titles of every page.
 * Writing rules (shown in the admin):
 *   *words*            → shown in the accent colour (headings)
 *   **words**          → bold
 *   [link text](/page) → a link
 *   a new line         → a line break
 *   {name} {role} {email} {company} → filled in from Site settings / About & experience
 */

const COLOUR = "Put *stars* around the words shown in colour.";
const RICH = "[Link text](/page) makes a link, **double stars** make bold text.";
const TOKENS = "{name} and {role} are filled in from Site settings.";

const text = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: "text",
  ...(description ? { admin: { description } } : {}),
});
const para = (name: string, label: string, description?: string, rows = 3): Field => ({
  name,
  label,
  type: "textarea",
  admin: { rows, ...(description ? { description } : {}) },
});
const heading = (name = "title", label = "Heading") => text(name, label, COLOUR);
const row = (...fields: Field[]): Field => ({ type: "row", fields });
const group = (name: string, label: string, fields: Field[], description?: string): Field => ({
  name,
  label,
  type: "group",
  ...(description ? { admin: { description } } : {}),
  fields,
});
const icon: Field = { name: "icon", label: "Icon", type: "select", required: true, options: ICON_NAMES.map((v) => ({ label: v, value: v })) };
const cards = (name: string, label: string): Field => ({
  name,
  label,
  type: "array",
  fields: [row(text("title", "Title"), icon), para("text", "Text")],
});

/** Title + description for Google and social shares */
export const seo = group("seo", "Google & social sharing", [text("title", "Page title"), para("description", "Description", "About 150 characters.")]);

/** Top of an inner page */
export const hero = (extra: Field[] = []) =>
  group("hero", "Top of the page", [text("eyebrow", "Small label above the heading"), heading(), para("lead", "Intro"), ...extra]);

/** The lime call-to-action band near the bottom */
export const cta = (secondary = true) =>
  group("cta", "Call-to-action band", [
    heading(),
    para("text", "Text", RICH),
    row(text("primary", "Main button"), ...(secondary ? [text("secondary", "Second button")] : [])),
  ]);

/** Small label + heading (+ optional extra fields) */
const section = (name: string, label: string, extra: Field[] = []) => group(name, label, [text("eyebrow", "Small label"), heading(), ...extra]);

/** Heading with a lime bar (inner pages) + optional text under it */
const mini = (name: string, label: string, withText = false) =>
  group(name, label, [text("title", "Heading"), ...(withText ? [para("text", "Text")] : [])]);

const pageTexts = (name: string, fields: Field[]): Field => ({
  name,
  label: "Page texts",
  type: "group",
  admin: { description: `Headings, intros, cards and buttons on this page. ${COLOUR} ${RICH}` },
  fields,
});

/* ------------------------------------------------------------------ */

export const homeTexts = pageTexts("texts", [
  seo,
  group("hero", "Top of the page", [
    text("eyebrow", "Small label above the heading", TOKENS),
    heading(),
    para("lead", "Intro", TOKENS),
    row(text("primary", "Main button"), text("secondary", "Second button")),
    {
      name: "showcase",
      label: "Screenshots (3, shown tilted — also on the Hire me page)",
      type: "array",
      maxRows: 3,
      fields: [
        { name: "image", label: "Image", type: "upload", relationTo: "media", required: true },
        text("alt", "Description", "Empty = the image's own description."),
      ],
    },
  ]),
  section("services", "Services band", [text("link", "Card link label")]),
  section("work", "Featured projects", [text("button", "Button")]),
  group("experienceBar", "Experience bar", [text("caption", "Text under the years")]),
  section("problems", "Problems"),
  section("aiWorkflow", "AI workflow band"),
  section("process", "Process", [text("button", "Button")]),
  section("faq", "FAQ", [para("text", "Text", RICH)]),
  group("cta", "Call-to-action band", [para("title", "Heading", "A new line starts a second line."), para("text", "Text"), text("primary", "Button")]),
]);

export const aboutTexts = pageTexts("aboutTexts", [
  seo,
  hero([
    para("intro", "Paragraph under the intro"),
    {
      name: "facts",
      label: "Quick facts",
      type: "array",
      fields: [row(text("label", "Text"), icon)],
    },
    row(text("primary", "Main button"), text("resume", "Résumé button")),
  ]),
  group("story", "My story", [
    text("title", "Heading"),
    heading("lead", "Big line"),
    para("left", "Left column", "Leave an empty line between paragraphs. {company} = the company from Experience.", 8),
    para("right", "Right column", "Leave an empty line between paragraphs.", 6),
    para("quote", "Highlighted line"),
    text("link", "Link label"),
  ]),
  group("whatIDo", "What I do", [text("title", "Heading"), para("text", "Text"), text("button", "Button")]),
  section("philosophy", "Philosophy band"),
  group("stack", "Technology stack", [
    text("title", "Heading"),
    text("button", "Button"),
    {
      name: "groups",
      label: "Groups",
      type: "array",
      fields: [row(text("title", "Title"), icon), para("items", "Items", "One per line.")],
    },
    row(text("experienceTitle", "Experience card title"), text("certificationsTitle", "Certifications card title")),
  ]),
  cta(),
]);

export const experienceTexts = pageTexts("experienceTexts", [
  seo,
  hero([
    {
      name: "stats",
      label: "Numbers",
      type: "array",
      maxRows: 3,
      fields: [row(text("value", "Number"), text("label", "Label"))],
    },
  ]),
  group("headings", "Section headings", [
    row(text("timeline", "Timeline"), text("certifications", "Certifications"), text("languages", "Languages")),
    row(text("aiWorkflow", "AI workflow"), text("skills", "Skills")),
    para("aiWorkflowText", "AI workflow text"),
  ]),
  cta(),
]);

export const servicesTexts = pageTexts("texts", [
  seo,
  hero([row(text("primary", "Main button"), text("secondary", "Second button"))]),
  group("cards", "Service cards", [row(text("link", "Link label"), text("tagsLabel", "Default tags heading"))]),
  group("packages", "Packages", [text("title", "Heading"), para("text", "Text"), text("button", "Button")]),
  mini("process", "Development process", true),
  cta(false),
]);

export const contactTexts = pageTexts("texts", [
  seo,
  hero([para("intro", "Paragraph under the intro"), text("formNote", "Line under the form")]),
  group("details", "Contact details", [
    row(text("email", "Email label"), text("phone", "Phone label"), text("location", "Location label")),
    row(text("availability", "Availability label"), text("availabilityValue", "Availability")),
    row(text("response", "Response time label"), text("responseValue", "Response time")),
    text("upwork", "Upwork button"),
  ]),
  group("steps", "Next steps", [
    text("title", "Heading"),
    { name: "items", label: "Steps", type: "array", maxRows: 3, fields: [row(text("title", "Title"), text("text", "Text"))] },
  ]),
  group("helpWith", "What can I help you build", [text("title", "Heading"), text("link", "Last card")]),
  section("faq", "FAQ", [para("text", "Text")]),
  group("form", "Contact form", [
    row(text("title", "Heading"), text("note", "Note under the heading")),
    row(text("name", "Name label"), text("namePlaceholder", "Name placeholder")),
    row(text("email", "Email label"), text("emailPlaceholder", "Email placeholder")),
    row(text("company", "Company label"), text("companyPlaceholder", "Company placeholder")),
    row(text("optional", "“optional” word"), text("type", "Project type label")),
    row(text("budget", "Budget label"), text("budgetPlaceholder", "Budget first option")),
    row(text("message", "Message label"), text("messagePlaceholder", "Message placeholder")),
    row(text("submit", "Send button"), text("sending", "While sending"), text("reply", "Line under the button")),
    row(text("sentTitle", "Sent: heading"), text("sentAgain", "Sent: button")),
    para("sentText", "Sent: text"),
    para("failed", "Could not send"),
    para("limited", "Too many messages"),
    text("fallback", "Email-app button"),
  ]),
  { ...cta(), admin: { description: `{email} = your email from Site settings. ${RICH}` } } as Field,
]);

export const workTexts = pageTexts("texts", [
  seo,
  hero(),
  group("filters", "Filter buttons", [
    row(text("all", "All"), text("nextjs", "Next.js"), text("migration", "Migration")),
    row(text("landing", "Landing pages"), text("wordpress", "WordPress"), text("ecommerce", "E-commerce")),
  ]),
  cta(false),
  group("caseStudy", "Project pages", [
    row(text("eyebrow", "Label before the category"), text("cta", "Call-to-action button")),
    row(text("client", "“Client”"), text("role", "“Role”"), text("stack", "“Stack”"), text("year", "“Year”")),
    ...(["overview", "challenge", "approach", "features", "gallery", "tech"] as const).map((s) =>
      group(s, s[0].toUpperCase() + s.slice(1), [row(text("eyebrow", "Small label"), text("title", "Heading"), text("nav", "Side menu"))]),
    ),
    row(text("previous", "Previous"), text("next", "Next")),
    row(text("back", "Back (first)"), text("backTo", "Back (last)"), text("all", "“All projects”")),
  ]),
]);

export const hireMeTexts = pageTexts("texts", [
  seo,
  hero([row(text("primary", "Main button"), text("upwork", "Upwork button"), text("work", "Work button (no Upwork)"))]),
  section("get", "What you get", [cards("items", "Cards")]),
  section("process", "Process"),
  section("why", "Why hire me", [para("text", "Text"), cards("items", "Cards")]),
  section("areas", "Areas of focus", [row(text("detailsTitle", "Last card title"), text("detailsText", "Last card text"))]),
  group("cta", "Call-to-action band", [heading(), para("text", "Text"), text("primary", "Main button")], "The second button reuses the hero's Upwork / Work label."),
]);

export const blogTexts = pageTexts("texts", [
  seo,
  hero([row(text("primary", "Main button"), text("secondary", "Second button"))]),
  group("empty", "When there are no posts", [text("eyebrow", "Small label"), para("text", "Text"), row(text("work", "Work button"), text("contact", "Contact button"))]),
  text("filterAll", "Filter: all posts"),
  cta(),
  group("post", "Post pages", [
    row(text("by", "“By”"), text("updated", "“Updated”"), text("minRead", "“min read”")),
    para("aiReviewed", "AI note (reviewed post)", RICH),
    para("aiUnreviewed", "AI note (auto-published post)", RICH),
    para("authorBio", "Author box text"),
    row(text("aboutLink", "Author box link"), text("relatedService", "“Related service”")),
    row(text("helpFallback", "Service title fallback"), text("viewService", "Service link")),
    row(text("more", "“Keep reading” heading"), text("allArticles", "All articles button")),
    group("cta", "Call-to-action band", [heading(), para("text", "Text"), row(text("primary", "Main button"), text("secondary", "Second button"))]),
  ]),
]);

/** Menu, footer, mobile bar and 404 — Site settings → "Layout" */
export const layoutTexts: Field = {
  name: "layout",
  label: "Menu, footer & 404",
  type: "group",
  admin: { description: `${COLOUR} ${TOKENS}` },
  fields: [
    group("menu", "Menu labels", [
      row(text("home", "Home"), text("about", "About"), text("services", "Services"), text("work", "Work")),
      row(text("experience", "Experience"), text("blog", "Blog"), text("contact", "Contact")),
    ]),
    group("seo", "Default Google title", [text("title", "Title"), para("keywords", "Keywords", "One per line.", 6)]),
    group("footer", "Footer", [
      text("subtitle", "Line under your name", TOKENS),
      row(text("rights", "After © year and name"), text("builtWith", "“Built with”"), text("using", "“using Next.js”")),
    ]),
    group("mobileBar", "Mobile bottom bar", [row(text("title", "Title"), text("text", "Text"), text("button", "Button"))]),
    group("notFound", "Page not found (404)", [
      text("eyebrow", "Small label"),
      heading(),
      para("lead", "Text"),
      row(text("home", "Main button"), text("projects", "Second button"), text("try", "“Or try:”")),
    ]),
  ],
};
