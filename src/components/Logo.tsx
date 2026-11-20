import Link from "next/link";
import { site } from "@/lib/data";

/** "VK" monogram: the V's right arm doubles as the K's stem */
export function LogoMark({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 40" className={className} aria-hidden="true" fill="currentColor">
      <path d="M0 2h11l12 26.5V38h-5.5z" />
      <path d="M21 2h9.5v36H21z" />
      <path d="M30.5 21.5 45 2h11L38.6 24.2z" />
      <path d="M35.2 19.4 56 38H44.6L30.5 25.4z" />
    </svg>
  );
}

/** Mark + divider + name, used in the header and footer */
export function Logo({ subtitle }: { subtitle?: string }) {
  return (
    <Link href="/" className="group flex items-center gap-4 text-accent" aria-label={`${site.name} — home`}>
      <LogoMark className="h-8 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105 sm:h-9" />
      <span aria-hidden="true" className="h-8 w-px bg-line-2" />
      <span className="flex flex-col leading-tight">
        <span className="whitespace-nowrap font-display text-[17px] font-bold tracking-[-0.01em] text-ink sm:text-[18px]">
          {site.name}
        </span>
        {subtitle && <span className="text-[12px] text-muted sm:whitespace-nowrap">{subtitle}</span>}
      </span>
    </Link>
  );
}
