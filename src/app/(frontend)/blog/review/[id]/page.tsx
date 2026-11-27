import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PostView } from "@/components/PostView";
import { getDraft, type Draft } from "@/lib/blog-drafts";
import { sceneImage } from "@/lib/blog-scene-art";
import { getContent } from "@/lib/content";
import { verifyReview } from "@/lib/review-link";
import { publishPost, rejectPost } from "../actions";

/**
 * Private preview of a blog draft, opened from the approval email or the admin's Preview button.
 * Shows the post exactly as it will look, with Publish / Don't publish buttons.
 * Access needs a signed, expiring link; the page is never indexed.
 */

export const metadata: Metadata = { title: "Review blog post", robots: { index: false, follow: false } };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ exp?: string; sig?: string; error?: string; removed?: string }>;
};

function Message({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-paper py-20">
      <div className="wrap flex max-w-[640px] flex-col items-start gap-4">
        <span className="eyebrow">Blog review</span>
        <h1 className="h-section">{title}</h1>
        <div className="text-[16px] leading-relaxed text-ink-2">{children}</div>
        <Link href="/blog" className="btn btn-line mt-2">
          Go to the blog <Icon name="arrow" />
        </Link>
      </div>
    </section>
  );
}

export default async function ReviewPage({ params, searchParams }: Props) {
  const [{ id: idParam }, { exp: expParam, sig, error, removed }] = await Promise.all([params, searchParams]);
  const id = Number(idParam);
  const exp = Number(expParam);
  const access = verifyReview(id, exp, sig, process.env.BLOG_REVIEW_SECRET);

  if (access === "invalid") {
    return (
      <Message title="This link doesn't work.">
        <p>Open the post from the latest review email or the Preview button in the admin — those links are the only way to preview and approve a draft.</p>
      </Message>
    );
  }
  if (access === "expired") {
    return (
      <Message title="This review link has expired.">
        <p>Open the draft in the admin (Blog posts) to preview or publish it.</p>
      </Message>
    );
  }

  let draft: Draft | null = null;
  let problem = "";
  try {
    draft = await getDraft(id);
  } catch (e) {
    problem = (e as Error).message;
  }

  if (!draft) {
    return removed ? (
      <Message title="Not published.">
        <p>The draft was removed. The next topic in the queue will be written next week.</p>
      </Message>
    ) : (
      <Message title="This draft can't be shown.">
        <p>{problem || "The draft was not found — it may have been removed."}</p>
      </Message>
    );
  }

  const { post, issues } = draft;
  const { site } = await getContent();
  const url = `${site.url}/blog/${post.slug}`;
  if (draft.state === "published") {
    return (
      <Message title="Published ✓">
        <p>
          <strong>{post.title}</strong> is live now:
        </p>
        <p className="mt-3">
          <a href={url} className="font-semibold text-accent underline decoration-lime decoration-2 underline-offset-4">
            {url}
          </a>
        </p>
      </Message>
    );
  }

  // a draft has no cached hero illustration yet, so draw it now
  const scenePng = post.cover ? null : Buffer.from(await (await sceneImage(post.scene, site)).arrayBuffer()).toString("base64");
  const hidden = (
    <>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="exp" value={exp} />
      <input type="hidden" name="sig" value={sig} />
    </>
  );
  const expires = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "Asia/Kolkata" }).format(new Date(exp * 1000));

  const panel = (where: "top" | "bottom") => (
    <div className="tile flex flex-col gap-5 border-accent-line p-6 md:p-7">
      {where === "top" && (
        <div className="flex flex-col gap-2">
          <span className="eyebrow">Private preview · not published yet</span>
          <h2 className="font-display text-[clamp(22px,2.4vw,28px)] font-bold text-accent">Publish this post?</h2>
          <p className="text-[15px] leading-relaxed text-muted">
            This is exactly how it will look on your blog. Read it, then publish it or leave it out — or edit it in the admin first. The link
            expires on {expires}.
          </p>
        </div>
      )}
      {where === "top" &&
        (issues.length === 0 ? (
          <p className="flex items-start gap-2.5 rounded-[12px] bg-accent-soft p-3.5 text-[14.5px] text-ink-2">
            <Icon name="check" strokeWidth={3} className="mt-0.5 size-4 shrink-0 text-accent" />
            {draft.doc.source === "autopost"
              ? "All checks passed: content rules and the AI fact-check against your website."
              : "Ready to publish — the content checks run when you press Publish."}
          </p>
        ) : (
          <div className="rounded-[12px] border border-[#e7c66b] bg-[#fdf6dd] p-4 text-[14.5px] text-ink-2">
            <p className="mb-2 font-semibold text-ink">Read these parts carefully — the checks flagged them:</p>
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              {issues.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      {error && (
        <p role="alert" className="rounded-[12px] border border-red-200 bg-red-50 p-3.5 text-[14px] text-red-800">
          Something went wrong: {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <form action={publishPost}>
          {hidden}
          <button type="submit" className="btn btn-primary min-h-13 px-7">
            Publish now <Icon name="send" />
          </button>
        </form>
        <Link href={`/admin/collections/posts/${id}`} className="btn btn-line min-h-13 px-6">
          Edit in the admin <Icon name="pen" />
        </Link>
        <details className="group">
          <summary className="btn btn-line min-h-13 cursor-pointer list-none px-6 [&::-webkit-details-marker]:hidden">Don&apos;t publish</summary>
          <form action={rejectPost} className="mt-3 flex flex-wrap items-center gap-3">
            {hidden}
            <span className="text-[14px] text-muted">The draft will be removed.</span>
            <button type="submit" className="btn btn-sm border border-red-300 bg-red-50 text-red-800 hover:bg-red-100">
              Yes, remove it
            </button>
          </form>
        </details>
      </div>
    </div>
  );

  return (
    <>
      <section className="bg-paper pt-8">
        <div className="wrap">{panel("top")}</div>
      </section>
      <PostView
        post={post}
        sceneSrc={scenePng ? `data:image/png;base64,${scenePng}` : undefined}
        badge={<span className="rounded-full bg-lime px-2.5 py-0.5 text-[12px] font-semibold text-accent">Preview — not published</span>}
      />
      <section className="bg-paper pb-16">
        <div className="wrap">{panel("bottom")}</div>
      </section>
    </>
  );
}
