import Link from "next/link";
import { ext, hasUpwork, nav, site } from "@/lib/data";
import { Icon } from "./Icon";

const expertise = ["AI Integration", "Claude Code", "MCP", "Next.js", "React", "Sanity CMS", "WordPress"];

const connect = [
  ...(hasUpwork ? [[site.socials.upwork, "Upwork"] as const] : []),
  [site.socials.linkedin, "LinkedIn"] as const,
  [site.socials.github, "GitHub"] as const,
];

export function Footer() {
  return (
    <footer className="bg-night text-night-muted">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-10 py-16 md:grid-cols-[1.7fr_1fr_1fr_1fr] md:gap-12">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 text-white">
              <span className="grid size-10 place-items-center rounded-full bg-white font-display text-[14px] font-bold text-ink">
                {site.initials}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-display text-[15px] font-bold">{site.name}</span>
                <span className="text-[12px] text-white/55">{site.role}</span>
              </span>
            </Link>
            <p className="max-w-[360px] text-[14.5px] leading-relaxed text-white/60">
              Building intelligent web experiences and modern digital products with AI-assisted development, Next.js, React, and
              Sanity CMS.
            </p>
            <ul className="flex flex-col gap-1.5 text-[14px]">
              <li className="flex items-center gap-2">
                <Icon name="pin" className="size-4 text-lime" /> Ahmedabad, India · Working Worldwide
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2 break-all transition-colors hover:text-white">
                  <Icon name="mail" className="size-4 shrink-0 text-lime" /> {site.email}
                </a>
              </li>
            </ul>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12.5px] text-white/75">
              <span className="dot dot-live" /> Open for work
            </span>
          </div>

          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <h2 className="mb-1.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-white/40">Quick links</h2>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="w-fit transition-colors hover:text-white">
                {n.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <h2 className="mb-1.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-white/40">Expertise</h2>
            <ul className="flex flex-col gap-2.5">
              {expertise.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <h2 className="mb-1.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-white/40">Connect</h2>
            {connect.map(([href, label]) => (
              <Link key={label} href={href} {...ext(href)} className="w-fit transition-colors hover:text-white">
                {label}
              </Link>
            ))}
            <Link href="/hire-me" className="w-fit transition-colors hover:text-white">Hire me</Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[13px] text-white/45">
          <span>© {new Date().getFullYear()} {site.name}. Designed &amp; Developed by me.</span>
          <div className="flex gap-2">
            {([
              ["linkedin", "LinkedIn", site.socials.linkedin],
              ["github", "GitHub", site.socials.github],
              ["mail", "Email", `mailto:${site.email}`],
            ] as const).map(([icon, label, href]) => (
              <Link
                key={label}
                href={href}
                {...ext(href)}
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
