/**
 * Emails Vinod the result of the weekly blog auto-post (used by .github/workflows/blog-autopost.yml).
 * Env: RESULT (approval | published | none | failed), TITLE, DESCRIPTION, URL, PR_NUMBER, RUN_URL, ISSUES_FILE
 *      + RESEND_API_KEY, BLOG_REVIEW_SECRET (see mail.mjs)
 */
import fs from "node:fs";
import { approvalLink, dateIN, emailHtml, sendMail } from "./mail.mjs";

const { RESULT = "failed", TITLE = "", DESCRIPTION = "", URL = "", PR_NUMBER = "", RUN_URL = "", ISSUES_FILE = "" } = process.env;

let issues = [];
try {
  issues = fs
    .readFileSync(ISSUES_FILE, "utf8")
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim());
} catch {}

if (RESULT === "approval") {
  const link = approvalLink(PR_NUMBER);
  const checks = issues.length ? "The checks flagged a few things — please read these parts carefully:" : "All checks passed: content rules, the AI fact-check against your website, and the site build.";
  const blocks = ["This week's post is written and waiting for you. It is NOT live yet.", DESCRIPTION, checks, ...(issues.length ? [issues] : [])].filter(Boolean);
  await sendMail({
    subject: `Approve this week's blog post: ${TITLE}`,
    text: [...blocks.flat(), "", link ? `Preview and publish: ${link.url}` : "(Approval link unavailable — BLOG_REVIEW_SECRET is not set.)", link ? `The link expires on ${dateIN(link.expires)}. Nothing is published without you.` : ""].join("\n"),
    html: emailHtml({
      label: "Blog post ready for approval",
      heading: TITLE,
      blocks,
      button: link && { label: "Preview & publish", url: link.url },
      footnote: link && `Opens a private preview on your site with Publish / Don't publish buttons. Expires on ${dateIN(link.expires)}.`,
    }),
  });
} else if (RESULT === "published") {
  const blocks = ["This week's post passed every check and is live:", URL, "Please give it a quick read when you have a moment."];
  await sendMail({ subject: `New blog post live: ${TITLE}`, text: blocks.join("\n"), html: emailHtml({ label: "Blog post published", heading: TITLE, blocks, button: { label: "Read the post", url: URL } }) });
} else if (RESULT === "none") {
  const blocks = ["No post was written this week because the topic list (content/blog/_topics.md) is empty.", "Add a few topics — or ask Claude to suggest some — and next week's run will pick them up."];
  await sendMail({ subject: "Blog topic list is empty", text: blocks.join("\n"), html: emailHtml({ label: "Weekly blog", heading: "Add new blog topics", blocks }) });
} else {
  const blocks = ["This week's post could not be prepared, so nothing was sent for approval or published.", ...(issues.length ? [issues] : ["Unknown error."]), "It will try again next week."];
  await sendMail({
    subject: "Blog auto-post: nothing this week",
    text: [...blocks.flat(), "", `Details: ${RUN_URL}`].join("\n"),
    html: emailHtml({ label: "Weekly blog", heading: "No post this week", blocks, button: RUN_URL && { label: "See details", url: RUN_URL } }),
  });
}
