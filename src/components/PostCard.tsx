import Image from "next/image";
import Link from "next/link";
import { coverOf, formatDate, keepDash, pillars, type PostMeta } from "@/lib/blog-meta";
import { Icon } from "./Icon";

/**
 * Blog post card — `lead` is the wide, side-by-side version used for the newest post.
 * `priority` loads the cover right away (cards near the top) instead of lazily.
 */
export function PostCard({ post, lead = false, priority = false }: { post: PostMeta; lead?: boolean; priority?: boolean }) {
  const cover = coverOf(post);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`tile tile-hover group grid h-full overflow-hidden ${lead ? "lg:grid-cols-[1.15fr_1fr]" : "grid-rows-[auto_1fr]"}`}
    >
      <span className="block overflow-hidden border-b border-line bg-surface-2 lg:border-b-0">
        <Image
          src={cover.src}
          alt=""
          width={cover.width}
          height={cover.height}
          loading={priority ? "eager" : "lazy"}
          sizes={lead ? "(min-width: 1024px) 660px, 100vw" : "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"}
          className={`aspect-1200/630 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${lead ? "lg:h-full" : ""}`}
        />
      </span>
      <span className={`flex flex-col gap-3.5 ${lead ? "p-6 md:p-8 lg:justify-center lg:p-10" : "p-6"}`}>
        <span className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-accent">
            {pillars[post.pillar].label}
          </span>
          {post.draft && <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-semibold text-accent">Draft</span>}
        </span>
        <h3
          className={`font-display font-bold leading-snug tracking-[-0.02em] text-ink transition-colors group-hover:text-accent ${
            lead ? "text-[clamp(22px,2.4vw,30px)]" : "text-[19px]"
          }`}
        >
          {keepDash(post.title)}
        </h3>
        <p className={`leading-relaxed text-muted ${lead ? "text-[16px]" : "line-clamp-3 text-[14.5px]"}`}>{post.description}</p>
        <span className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-[13px] text-muted">
          <span>
            <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
          </span>
          <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent">
            Read <span className="sr-only">article</span>
            <Icon name="arrow" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </span>
      </span>
    </Link>
  );
}
