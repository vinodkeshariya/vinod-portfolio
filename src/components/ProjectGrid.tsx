"use client";

import Link from "next/link";
import { useState } from "react";
import { projectFilters, projects } from "@/lib/data";
import { Icon } from "./Icon";
import { ProjectCard } from "./ProjectCard";

type FilterId = (typeof projectFilters)[number]["id"];

export function ProjectGrid() {
  const [filter, setFilter] = useState<FilterId>("all");
  const visible = projects.filter((p) => filter === "all" || p.filters.includes(filter));
  const label = projectFilters.find((f) => f.id === filter)?.label;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filter projects" className="flex gap-1 rounded-full border border-line bg-surface p-1 shadow-(--shadow-soft) max-lg:w-full max-lg:overflow-x-auto max-lg:[scrollbar-width:none] lg:flex-wrap">
          {projectFilters.map((f) => {
            const count = f.id === "all" ? projects.length : projects.filter((p) => p.filters.includes(f.id)).length;
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] font-medium transition-colors ${
                  active ? "bg-accent text-white" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                }`}
              >
                {f.label}
                <span
                  className={`grid min-w-5 place-items-center rounded-full px-1.5 font-mono text-[11px] ${
                    active ? "bg-white/15 text-white" : "bg-surface-2 text-faint"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <p className="font-mono text-[12.5px] text-faint" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
          {filter !== "all" && <> · {label}</>}
        </p>
      </div>

      <div key={filter} className="grid animate-fade-up gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {visible.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={projects.indexOf(p) + 1} reveal={false} priority={i < 2} />
        ))}
      </div>

      {/* Next project CTA */}
      <div className="relative mt-6 overflow-hidden rounded-[14px] border border-line bg-ivory p-7 md:p-9">
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex max-w-[560px] flex-col gap-2">
            <span className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-accent">
              Project {String(projects.length + 1).padStart(2, "0")}
            </span>
            <h2 className="text-[clamp(24px,2.6vw,32px)] font-extrabold tracking-[-0.03em]">Interested in Working Together?</h2>
            <p className="text-[15px] text-muted">Have a similar project? Let&apos;s discuss your requirements.</p>
          </div>
          <Link href="/contact" className="btn btn-primary">
            Start a Project <Icon name="arrow" />
          </Link>
        </div>
      </div>
    </>
  );
}
