import Link from "next/link";
import { getPosts } from "@/lib/blog";
import { ext, hasUpwork, nav, site } from "@/lib/data";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const socials = [
  ["github", "GitHub", site.socials.github],
  ["linkedin", "LinkedIn", site.socials.linkedin],
  ...(hasUpwork ? [["upwork", "Upwork", site.socials.upwork] as const] : []),
  ["mail", "Email", `mailto:${site.email}`],
] as const;

export function Footer() {
  // "Blog" appears automatically once the first post is published
  const links = [...nav.filter((n) => n.href !== "/"), ...(getPosts().some((p) => !p.draft) ? [{ href: "/blog", label: "Blog" }] : [])];

  return (
    <footer className="bg-paper">
      <div className="wrap">
        <div className="flex flex-col gap-8 border-t border-line py-10 lg:flex-row lg:items-center lg:justify-between">
          <Logo subtitle={`${site.role} · Ahmedabad, India`} />

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] font-medium text-ink-2">
              {links.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="transition-colors hover:text-accent">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-3">
            {socials.map(([icon, label, href]) => (
              <Link
                key={label}
                href={href}
                {...ext(href)}
                aria-label={label}
                className="grid size-11 place-items-center rounded-full bg-accent text-white transition duration-300 hover:-translate-y-1 hover:bg-lime hover:text-accent"
              >
                <Icon name={icon} className="size-[18px]" />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-6 text-[13.5px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built with
            <svg viewBox="0 0 24 24" className="size-4 text-[#d6453d]" fill="currentColor" aria-label="love" role="img">
              <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 5.2 3 1.6-1.9 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z" />
            </svg>
            using Next.js
          </span>
        </div>
      </div>
    </footer>
  );
}
