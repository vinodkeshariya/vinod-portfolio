"use client";

import { useState } from "react";
import { projectFilters, type Project } from "@/lib/data";
import { ProjectCard } from "./ProjectCard";

type FilterId = (typeof projectFilters)[number]["id"];

/** `labels`: the filter button names from the CMS (Work & project pages) */
export function ProjectGrid({ projects, labels }: { projects: Project[]; labels: Record<FilterId, string> }) {
  const filters = projectFilters.map((f) => ({ ...f, label: labels[f.id] || f.label }));
  const [filter, setFilter] = useState<FilterId>("all");
  const visible = projects.filter((p) => filter === "all" || p.filters.includes(filter));
  const label = filters.find((f) => f.id === filter)?.label;

  return (
    <>
      <div
        role="group"
        aria-label="Filter projects"
        className="mb-8 flex gap-2.5 max-lg:-mx-5 max-lg:overflow-x-auto max-lg:px-5 max-lg:pb-1 max-lg:[scrollbar-width:none] sm:max-lg:-mx-8 sm:max-lg:px-8 lg:flex-wrap"
      >
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.id)}
              className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center whitespace-nowrap rounded-full border px-5 text-[14px] font-semibold transition duration-200 ${
                active
                  ? "border-accent bg-accent text-white shadow-[0_10px_20px_-12px_rgb(21_61_53/0.6)]"
                  : "border-line-2 bg-surface text-ink-2 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {filter !== "all" && <> · {label}</>}
      </p>

      <div key={filter} className="grid animate-fade-up gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {visible.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={projects.indexOf(p) + 1} reveal={false} priority={i < 3} />
        ))}
      </div>
    </>
  );
}
