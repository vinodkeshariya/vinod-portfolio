import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data";
import { Icon } from "./Icon";

/**
 * Compact editorial project card: 16:10 cover, category + year, title,
 * full summary, tech labels and a "View project" link.
 */
export function ProjectCard({
  project,
  index,
  delay,
  priority = false,
  reveal = true,
}: {
  project: Project;
  index: number;
  delay?: number;
  priority?: boolean;
  /** Disable for cards that mount after page load (e.g. filtered lists) */
  reveal?: boolean;
}) {
  const num = String(index).padStart(2, "0");

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-reveal={reveal || undefined}
      data-delay={reveal ? delay : undefined}
      className="group flex flex-col overflow-hidden rounded-[14px] border border-line bg-surface shadow-(--shadow-soft) transition duration-300 ease-out hover:border-line-2 hover:shadow-(--shadow-card)"
    >
      <div className="relative aspect-16/10 overflow-hidden border-b border-line" style={{ backgroundColor: project.tint }}>
        <Image
          src={project.cover}
          alt={`${project.title} — homepage`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex grow flex-col gap-3 p-5">
        <div className="flex items-center gap-2.5 font-mono text-[11.5px] text-faint">
          <span className="font-semibold text-accent">{num}</span>
          <span aria-hidden="true" className="h-px w-4 bg-line-2" />
          <span className="truncate">{project.category}</span>
          <span className="ml-auto shrink-0">{project.year}</span>
        </div>

        <div>
          <h3 className="text-[17px] font-bold leading-snug tracking-[-0.02em] transition-colors group-hover:text-accent">{project.title}</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{project.summary}</p>
        </div>

        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tags.map((t) => (
            <li key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-[12px] font-medium text-ink-2">{t}</li>
          ))}
        </ul>

        <span className="mt-auto inline-flex items-center gap-1.5 border-t border-line pt-4 text-[14px] font-semibold text-ink transition-colors group-hover:text-accent">
          View project
          <Icon name="arrowUpRight" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
