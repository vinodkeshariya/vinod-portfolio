import Link from "next/link";
import { Icon } from "./Icon";

/** Section heading: eyebrow + title + optional text + optional action */
export function SectionHead({
  eyebrow,
  title,
  text,
  action,
  className = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div data-reveal className={`mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-14 ${className}`}>
      <div className="flex max-w-[620px] flex-col gap-3">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h-section">{title}</h2>
        {text && <p className="max-w-[560px] leading-relaxed text-muted">{text}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn btn-ghost btn-sm">
          {action.label} <Icon name="arrow" />
        </Link>
      )}
    </div>
  );
}

/** Inner-page hero with breadcrumbs and an optional visual on the right */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
  aside,
}: {
  crumbs: { href?: string; label: string }[];
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="hero-bg border-b border-line">
      <div
        className={`wrap relative z-10 grid items-center gap-12 pb-16 pt-12 md:pb-20 md:pt-16 ${
          aside ? "lg:grid-cols-[1fr_1fr] lg:gap-16" : ""
        }`}
      >
        <div className="flex flex-col items-start gap-5">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2.5 font-mono text-[12.5px] text-faint">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex gap-2.5">
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink">{c.label}</Link>
                ) : (
                  <span aria-current="page" className="text-ink-2">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
              </span>
            ))}
          </nav>
          {eyebrow && (typeof eyebrow === "string" ? <span className="eyebrow">{eyebrow}</span> : eyebrow)}
          <h1 className="h-page max-w-[640px]">{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
        </div>
        {aside}
      </div>
    </section>
  );
}

/** Dark call-to-action band */
export function CtaBand({
  title,
  text,
  primary,
  secondary,
  children,
}: {
  title: React.ReactNode;
  text?: React.ReactNode;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <section className="py-16 md:py-20">
      <div className="wrap">
        <div
          data-reveal
          className="bg-forest relative grid items-end gap-8 overflow-hidden rounded-[18px] p-8 text-white md:grid-cols-[1.4fr_auto] md:p-14"
        >
          <div className="relative">
            <h2 className="text-[clamp(28px,3.4vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em]">{title}</h2>
            {text && <p className="mt-4 max-w-[540px] text-[16.5px] text-night-muted">{text}</p>}
            {children}
          </div>
          <div className="relative flex flex-wrap gap-3">
            {primary && <Link href={primary.href} className="btn btn-lime">{primary.label}</Link>}
            {secondary && <Link href={secondary.href} className="btn btn-outline-light">{secondary.label}</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TickList({ items, twoCol = false }: { items: string[]; twoCol?: boolean }) {
  return (
    <ul className={`grid gap-3 ${twoCol ? "sm:grid-cols-2 sm:gap-x-7" : ""}`}>
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-ink-2">
          <Icon name="check" strokeWidth={2.4} className="mt-0.5 size-5 shrink-0 text-accent" />
          {t}
        </li>
      ))}
    </ul>
  );
}

export function Chips({ items, fill = false }: { items: string[]; fill?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className={`chip ${fill ? "chip-fill" : ""}`}>{t}</span>
      ))}
    </div>
  );
}

export function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-1 text-accent ${className}`} role="img" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" filled className="size-4" />
      ))}
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) =>
    items.map((t) => (
      <span key={`${t}-${hidden}`} aria-hidden={hidden || undefined} className="flex items-center gap-14 whitespace-nowrap">
        {t}
        <span className="text-xs text-accent">✦</span>
      </span>
    ));
  return (
    <div className="overflow-hidden border-y border-line bg-paper-2 py-5" aria-label="Technologies I work with">
      <div className="flex w-max animate-marquee gap-14 font-display text-xl font-medium text-faint hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
