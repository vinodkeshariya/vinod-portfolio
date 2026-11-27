import Link from "next/link";
import { Icon } from "./Icon";

/** Section heading: lime-rule eyebrow + forest title + optional text + optional action (home-page style) */
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
    <div data-reveal className={`mb-10 flex flex-wrap items-end justify-between gap-6 ${className}`}>
      <div className="flex max-w-[640px] flex-col gap-3">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h-section">{title}</h2>
        {text && <p className="max-w-[560px] text-[15.5px] leading-relaxed text-muted">{text}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn btn-line px-6">
          {action.label} <Icon name="arrow" />
        </Link>
      )}
    </div>
  );
}

/** Compact section heading with a lime bar, used on the inner pages */
export function MiniHead({
  children,
  text,
  className = "",
}: {
  children: React.ReactNode;
  text?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-7 flex flex-col gap-2 ${className}`}>
      <h2 className="flex items-center gap-3 font-display text-[clamp(21px,2vw,26px)] font-bold tracking-[-0.02em] text-accent">
        <span aria-hidden="true" className="h-[3px] w-6 shrink-0 rounded-full bg-lime" />
        {children}
      </h2>
      {text && <p className="max-w-[620px] pl-9 text-[15px] leading-relaxed text-muted">{text}</p>}
    </div>
  );
}

/** Inner-page hero: lime-dot eyebrow, forest headline, optional illustration — same language as the home hero */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
  aside,
}: {
  crumbs?: { href?: string; label: string }[];
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  // Breadcrumbs only for deeper pages (e.g. a case study); top-level pages use the header nav
  const trail = crumbs && crumbs.length > 2 ? crumbs : null;
  return (
    <section className="relative overflow-hidden bg-paper">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12%] -top-[34%] hidden aspect-square w-[58%] rounded-full border border-lime/40 bg-[radial-gradient(circle_at_40%_60%,rgb(214_230_166/0.4),transparent_65%)] lg:block"
      />
      <div
        className={`wrap relative grid items-center gap-12 pb-14 pt-12 md:pb-16 md:pt-16 lg:pt-14 ${
          aside ? "lg:grid-cols-[1.05fr_1fr] lg:gap-10" : ""
        }`}
      >
        <div className="flex flex-col items-start gap-6">
          {trail && (
            <nav aria-label="Breadcrumb" className="animate-fade-up flex flex-wrap gap-2.5 text-[13.5px] text-muted">
              {trail.map((c, i) => (
                <span key={c.label} className="flex gap-2.5">
                  {c.href ? (
                    <Link href={c.href} className="-my-1.5 inline-block py-1.5 transition-colors hover:text-accent">{c.label}</Link>
                  ) : (
                    <span aria-current="page" className="font-medium text-ink-2">{c.label}</span>
                  )}
                  {i < trail.length - 1 && <span aria-hidden="true">/</span>}
                </span>
              ))}
            </nav>
          )}
          {eyebrow &&
            (typeof eyebrow === "string" ? (
              <span className="animate-fade-up flex items-center gap-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-ink-2">
                <span className="relative flex size-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-lime opacity-60 motion-reduce:hidden" />
                  <span className="relative size-2.5 rounded-full bg-lime" />
                </span>
                {eyebrow}
              </span>
            ) : (
              <div className="animate-fade-up">{eyebrow}</div>
            ))}
          <h1
            style={{ animationDelay: "80ms" }}
            className="animate-fade-up max-w-[640px] text-[clamp(38px,4.6vw,60px)] font-extrabold leading-[1.04] tracking-[-0.04em] text-accent"
          >
            {title}
          </h1>
          {lead && (
            <p style={{ animationDelay: "160ms" }} className="animate-fade-up max-w-[560px] text-[clamp(16px,1.3vw,17.5px)] leading-[1.7] text-ink-2">
              {lead}
            </p>
          )}
          {children && (
            <div style={{ animationDelay: "240ms" }} className="animate-fade-up flex w-full flex-col items-start gap-5">
              {children}
            </div>
          )}
        </div>
        {aside}
      </div>
    </section>
  );
}

type CtaLink = { href: string; label: string };

/** Routes use <Link>; files, mailto and external URLs use a plain anchor */
function CtaButton({ link, primary }: { link: CtaLink; primary?: boolean }) {
  const cls = primary
    ? "btn btn-primary min-h-14 w-full px-8 text-[16px] sm:w-auto"
    : "btn btn-line min-h-14 w-full px-7 text-[15.5px] sm:w-auto";
  // a document (e.g. the résumé PDF, local or in Vercel Blob with ?download=1) is downloaded, not opened
  const isFile = /\.(pdf|docx?)$/i.test(link.href.split(/[?#]/)[0]);
  const isRoute = link.href.startsWith("/") && !isFile;
  const icon = primary ? <Icon name="arrow" /> : isFile ? <Icon name="download" /> : null;
  return isRoute ? (
    <Link href={link.href} className={cls}>{link.label} {icon}</Link>
  ) : (
    <a
      href={link.href}
      className={cls}
      {...(isFile ? { download: "" } : {})}
      {...(link.href.startsWith("http") && !isFile ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {link.label} {icon}
    </a>
  );
}

/** Lime call-to-action band — identical styling to the one at the bottom of the home page */
export function CtaBand({
  title,
  text,
  primary,
  secondary,
  children,
}: {
  title: React.ReactNode;
  text?: React.ReactNode;
  primary?: CtaLink;
  secondary?: CtaLink;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-paper pb-14 md:pb-16">
      <div className="mx-auto w-full max-w-[1320px] sm:px-3">
        <div
          data-reveal
          className="animate-gradient-pan grid items-center gap-6 bg-[linear-gradient(100deg,#d6e6a6_0%,#eef4d6_35%,#d6e6a6_70%,#e8f0c8_100%)] bg-size-[220%_220%] px-6 py-10 sm:rounded-[24px] sm:px-12 lg:grid-cols-[1.2fr_1fr_auto] lg:gap-10"
        >
          <h2 className="text-[clamp(26px,2.8vw,36px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-accent">{title}</h2>
          <div className="text-[15.5px] leading-relaxed text-ink-2 lg:border-l lg:border-accent/20 lg:pl-10">
            {text}
            {children}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            {primary && <CtaButton link={primary} primary />}
            {secondary && <CtaButton link={secondary} />}
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
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-lime">
            <Icon name="check" strokeWidth={3} className="size-3" />
          </span>
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
