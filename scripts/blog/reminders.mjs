/**
 * Daily check of blog drafts waiting for approval (.github/workflows/blog-reminders.yml):
 *   - after 3 days: one reminder email with a fresh approval link
 *   - after 7 days: the draft is closed (not published) and Vinod is told
 * Env: GITHUB_TOKEN, GITHUB_REPOSITORY, RESEND_API_KEY, BLOG_REVIEW_SECRET
 */
import { approvalLink, dateIN, emailHtml, sendMail } from "./mail.mjs";

const REPO = process.env.GITHUB_REPOSITORY || "vinodkeshariya/vinod-portfolio";
const DAY = 86_400_000;

async function gh(path, init = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok && res.status !== 404 && res.status !== 422) throw new Error(`GitHub ${path}: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json().catch(() => null);
}

const pulls = (await gh("/pulls?state=open&per_page=50")) ?? [];
const drafts = pulls.filter((p) => p.head.ref.startsWith("blog-draft/"));
console.log(`[reminders] ${drafts.length} draft(s) waiting for approval`);

for (const pr of drafts) {
  const created = Date.parse(pr.created_at);
  const age = (Date.now() - created) / DAY;
  const title = pr.title.replace(/^Blog draft:\s*/, "");

  if (age >= 7) {
    await gh(`/pulls/${pr.number}`, { method: "PATCH", body: JSON.stringify({ state: "closed" }) });
    await gh(`/git/refs/heads/${pr.head.ref}`, { method: "DELETE" });
    const blocks = [`"${title}" waited 7 days without approval, so it was removed and not published.`, "Nothing to do — next week's post will arrive as usual."];
    await sendMail({ subject: `Blog draft expired: ${title}`, text: blocks.join("\n"), html: emailHtml({ label: "Weekly blog", heading: "Draft expired", blocks }) });
  } else if (age >= 3 && age < 4) {
    const link = approvalLink(pr.number, created);
    if (!link) continue;
    const blocks = [`"${title}" is still waiting for your approval. It will not go live unless you publish it.`];
    await sendMail({
      subject: `Reminder: approve your blog post — ${title}`,
      text: [...blocks, `Preview and publish: ${link.url}`, `The link expires on ${dateIN(link.expires)}.`].join("\n"),
      html: emailHtml({
        label: "Reminder",
        heading: title,
        blocks,
        button: { label: "Preview & publish", url: link.url },
        footnote: `The draft is removed on ${dateIN(link.expires)} if it isn't published.`,
      }),
    });
  }
}
