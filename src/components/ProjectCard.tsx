import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data";
import { Icon } from "./Icon";

/** Work-page card in the home-page style: cover, title, category · year, short summary and a "View project" pill */
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
      className="tile tile-hover group flex flex-col overflow-hidden hover:shadow-(--shadow-float)"
    >
      <div className="relative aspect-16/10 overflow-hidden border-b border-line" style={{ backgroundColor: project.tint }}>
        <Image
          src={project.cover}
          alt={`${project.title} — homepage`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[11px] font-semibold text-accent backdrop-blur">
          {num}
        </span>
      </div>

      <div className="flex grow flex-col gap-2.5 p-5">
        <h3 className="text-[18px] font-bold leading-snug tracking-[-0.02em] text-ink transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="text-[13.5px] font-medium text-faint">
          {project.category} <span aria-hidden="true">·</span> {project.year}
        </p>
        <p className="line-clamp-2 text-[14px] leading-relaxed text-muted">{project.summary}</p>

        <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-line-2 px-4 py-2 text-[13.5px] font-semibold text-ink transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
          View project
          <Icon name="arrow" className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
