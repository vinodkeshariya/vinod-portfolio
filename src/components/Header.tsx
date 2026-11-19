"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/data";
import { Icon } from "./Icon";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  // Close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        scrolled ? "border-line bg-surface/95 shadow-(--shadow-soft)" : "border-line bg-surface"
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 h-0.5 origin-left bg-accent transition-transform duration-150"
        style={{ width: "100%", transform: `scaleX(${progress})` }}
      />
      <nav aria-label="Main" className="wrap flex min-h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} — home`}>
          <span className="relative grid size-10 place-items-center rounded-full bg-accent font-display text-[14px] font-bold text-white ring-2 ring-white">
            {site.initials}
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-lime" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="whitespace-nowrap font-display text-[15px] font-bold tracking-[-0.01em]">{site.name}</span>
            <span className="whitespace-nowrap text-[12px] text-muted">{site.short}</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 rounded-full border border-line bg-surface-2 p-1 lg:flex">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block whitespace-nowrap rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors ${
                    active ? "bg-accent text-white" : "text-ink-2 hover:bg-surface hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 whitespace-nowrap text-[12.5px] text-muted 2xl:flex">
            <span className="dot dot-live" />
            Open for work
          </span>
          <Link href="/hire-me" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Let&apos;s talk <Icon name="arrowUpRight" />
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line-2 bg-surface lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div id="mobile-menu" hidden={!open} className="border-t border-line bg-surface lg:hidden">
        <ul className="wrap flex flex-col gap-1 py-4">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 items-center justify-between rounded-xl px-4 text-[17px] font-semibold ${
                    active ? "bg-surface text-accent shadow-(--shadow-soft)" : "hover:bg-surface"
                  }`}
                >
                  {item.label}
                  <Icon name="arrowUpRight" className="size-4 opacity-50" />
                </Link>
              </li>
            );
          })}
          <li className="pt-3">
            <Link href="/hire-me" className="btn btn-primary w-full">
              Let&apos;s talk <Icon name="arrow" />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
