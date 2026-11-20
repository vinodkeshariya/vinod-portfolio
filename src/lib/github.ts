import "server-only";

/**
 * Minimal GitHub API client for approving blog drafts from the review page.
 * Env: BLOG_GITHUB_TOKEN — a fine-grained token for this repository with
 *      "Contents: Read and write" and "Pull requests: Read and write".
 * Only pull requests from `blog-draft/…` branches are ever touched.
 */

const REPO = process.env.BLOG_GITHUB_REPO || "vinodkeshariya/vinod-portfolio";

async function gh<T = unknown>(path: string, init: RequestInit = {}): Promise<{ ok: boolean; status: number; data: T }> {
  const token = process.env.BLOG_GITHUB_TOKEN;
  if (!token) throw new Error("BLOG_GITHUB_TOKEN is not set");
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "vinod-portfolio-blog-review",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, data: (text ? JSON.parse(text) : null) as T };
}

type PullRequest = { number: number; state: "open" | "closed"; merged_at: string | null; title: string; body: string | null; head: { ref: string; sha: string } };
type PullFile = { filename: string; status: string };

export type Draft = {
  pr: number;
  state: "open" | "published" | "rejected";
  branch: string;
  file: string;
  raw: string;
  /** "What to check" items from the pull request description (empty when every check passed) */
  issues: string[];
};

/** Loads a blog-draft pull request and its post file, or null if it isn't one */
export async function getDraft(pr: number): Promise<Draft | null> {
  const { ok, data: pull } = await gh<PullRequest>(`/pulls/${pr}`);
  if (!ok || !pull.head.ref.startsWith("blog-draft/")) return null;

  const { data: files } = await gh<PullFile[]>(`/pulls/${pr}/files`);
  const file = files.find((f) => /^content\/blog\/[a-z0-9-]+\.md$/.test(f.filename) && f.status !== "removed")?.filename;
  if (!file) return null;

  const { ok: gotFile, data: content } = await gh<{ content: string }>(`/contents/${file}?ref=${pull.head.sha}`);
  if (!gotFile) return null;

  const body = pull.body ?? "";
  const checks = body.split("### What to check")[1]?.split(/\n#{2,3} |\n\n[A-Z]/)[0] ?? "";
  return {
    pr,
    state: pull.merged_at ? "published" : pull.state === "closed" ? "rejected" : "open",
    branch: pull.head.ref,
    file,
    raw: Buffer.from(content.content, "base64").toString("utf8"),
    issues: checks
      .split("\n")
      .filter((l) => l.startsWith("- "))
      .map((l) => l.slice(2).trim()),
  };
}

/** Merges the draft (it goes live with the next Vercel deploy) and removes its branch */
export async function publishDraft(pr: number, title: string) {
  const draft = await getDraft(pr);
  if (!draft) return { ok: false, message: "This draft could not be found." };
  if (draft.state !== "open") return { ok: true, message: "Already handled." };
  const merge = await gh<{ merged: boolean; message?: string }>(`/pulls/${pr}/merge`, {
    method: "PUT",
    body: JSON.stringify({ merge_method: "squash", commit_title: `Blog: ${title}` }),
  });
  if (!merge.ok || !merge.data?.merged) return { ok: false, message: merge.data?.message || `GitHub returned ${merge.status}.` };
  await gh(`/git/refs/heads/${draft.branch}`, { method: "DELETE" });
  return { ok: true, message: "Published." };
}

/** Closes the draft without publishing and removes its branch */
export async function rejectDraft(pr: number) {
  const draft = await getDraft(pr);
  if (!draft) return { ok: false, message: "This draft could not be found." };
  if (draft.state !== "open") return { ok: true, message: "Already handled." };
  const close = await gh(`/pulls/${pr}`, { method: "PATCH", body: JSON.stringify({ state: "closed" }) });
  if (!close.ok) return { ok: false, message: `GitHub returned ${close.status}.` };
  await gh(`/git/refs/heads/${draft.branch}`, { method: "DELETE" });
  return { ok: true, message: "Rejected." };
}
