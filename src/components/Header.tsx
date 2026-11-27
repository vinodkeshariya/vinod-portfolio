"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/data";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header({ name }: { name: string }) {
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

  const links = nav.filter((n) => n.href !== "/");

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled ? "border-line bg-paper/95 shadow-(--shadow-soft) backdrop-blur-xl" : "border-line/70 bg-paper"
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 h-0.5 origin-left bg-accent transition-transform duration-150"
        style={{ width: "100%", transform: `scaleX(${progress})` }}
      />
      <nav aria-label="Main" className="wrap flex min-h-[76px] items-center justify-between gap-4 lg:min-h-[84px]">
        <Logo name={name} />

        <ul className="hidden items-center gap-9 lg:flex">
          {links.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative block py-2 text-[15px] font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-lime after:transition-transform ${
                    active ? "text-accent after:scale-x-100" : "text-ink-2 after:scale-x-0 hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn btn-lime hidden px-6 sm:inline-flex">
            Let&apos;s talk <Icon name="arrow" />
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
      <div id="mobile-menu" hidden={!open} className="border-t border-line bg-paper lg:hidden">
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
            <Link href="/contact" className="btn btn-lime w-full">
              Let&apos;s talk <Icon name="arrow" />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
