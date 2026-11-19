import Link from "next/link";
import { site } from "@/lib/data";
import { Icon } from "./Icon";

const groups = [
  { title: "Pages", links: [["/about", "About"], ["/services", "Services"], ["/projects", "Projects"], ["/experience", "Experience"]] },
  { title: "Work with me", links: [["/hire-me", "Hire me"], ["/contact", "Contact"], [site.socials.upwork, "Upwork"], [site.socials.linkedin, "LinkedIn"]] },
] as const;

export function Footer() {
  return (
    <footer className="bg-night text-night-muted">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-10 py-16 md:grid-cols-[1.8fr_1fr_1fr] md:gap-14">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 text-white">
              <span className="grid size-10 place-items-center rounded-full bg-white font-display text-[14px] font-bold text-ink">
                {site.initials}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-display text-[15px] font-bold">{site.name}</span>
                <span className="text-[12px] text-white/55">{site.short}</span>
              </span>
            </Link>
            <p className="max-w-[360px] text-[14.5px] leading-relaxed text-white/60">
              Fast Next.js + Sanity websites your team can edit without code. Figma and WordPress to Next.js — from {site.location.split(",")[0]}, working worldwide.
            </p>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12.5px] text-white/75">
              <span className="dot dot-live" /> Open for work
            </span>
          </div>

          {groups.map((g) => (
            <div key={g.title} className="flex flex-col gap-2.5 text-[14.5px]">
              <h2 className="mb-1.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-white/40">{g.title}</h2>
              {g.links.map(([href, label]) => (
                <Link key={label} href={href} className="w-fit transition-colors hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[13px] text-white/45">
          <span>© {new Date().getFullYear()} {site.name}. Designed & built by me.</span>
          <div className="flex gap-2">
            {([
              ["linkedin", "LinkedIn", site.socials.linkedin],
              ["github", "GitHub", site.socials.github],
              ["mail", "Email", "/contact"],
            ] as const).map(([icon, label, href]) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-white/10 text-white/70 transition hover:border-white/40 hover:text-white"
              >
                <Icon name={icon} className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
