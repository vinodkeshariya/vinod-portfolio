"use client";

import { useState } from "react";
import { pillars, type Pillar, type PostMeta } from "@/lib/blog-meta";
import { PostCard } from "./PostCard";

const PAGE = 9;

/**
 * Blog index: newest post as a wide card, the rest in a 3-column grid.
 * Category filters appear once posts span two or more categories; "Show more" after 9 posts.
 */
export function BlogGrid({ posts }: { posts: PostMeta[] }) {
  const [filter, setFilter] = useState<Pillar | "all">("all");
  const [shown, setShown] = useState(PAGE);

  const used = (Object.keys(pillars) as Pillar[]).filter((k) => posts.some((p) => p.pillar === k));
  const visible = posts.filter((p) => filter === "all" || p.pillar === filter);
  // the newest post gets the wide card on "All"; filtered views are a plain grid
  const lead = filter === "all" ? visible[0] : undefined;
  const rest = filter === "all" ? visible.slice(1) : visible;
  const page = rest.slice(0, shown);

  const choose = (f: Pillar | "all") => {
    setFilter(f);
    setShown(PAGE);
  };

  return (
    <>
      {used.length > 1 && (
        <div
          role="group"
          aria-label="Filter articles by category"
          className="mb-8 flex gap-2.5 max-lg:-mx-5 max-lg:overflow-x-auto max-lg:px-5 max-lg:pb-1 max-lg:[scrollbar-width:none] sm:max-lg:-mx-8 sm:max-lg:px-8 lg:flex-wrap"
        >
          {(["all", ...used] as const).map((f) => {
            const active = filter === f;
            const count = f === "all" ? posts.length : posts.filter((p) => p.pillar === f).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => choose(f)}
                className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-5 text-[14px] font-semibold transition duration-200 ${
                  active
                    ? "border-accent bg-accent text-white shadow-[0_10px_20px_-12px_rgb(21_61_53/0.6)]"
                    : "border-line-2 bg-surface text-ink-2 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                }`}
              >
                {f === "all" ? "All articles" : pillars[f].label}
                <span className={`text-[12px] font-medium ${active ? "text-lime" : "text-faint"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "article" : "articles"}
        {filter !== "all" && <> · {pillars[filter].label}</>}
      </p>

      <div key={filter} className="flex animate-fade-up flex-col gap-5 lg:gap-6">
        {lead && <PostCard post={lead} lead priority />}
        {page.length > 0 && (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {page.map((p, i) => (
              <li key={p.slug}>
                <PostCard post={p} priority={!lead && i < 3} />
              </li>
            ))}
          </ul>
        )}
        {rest.length > shown && (
          <button type="button" onClick={() => setShown((n) => n + PAGE)} className="btn btn-line mx-auto mt-2 px-7">
            Show more articles
          </button>
        )}
      </div>
    </>
  );
}
