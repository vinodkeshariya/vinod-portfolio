import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/data";

/** Vinod's photo in a lime ring — the site's logo mark */
export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <Image
      src="/images/vinod-photo.webp"
      alt=""
      width={80}
      height={80}
      loading="eager"
      className={`rounded-full object-cover ring-2 ring-lime ${className}`}
    />
  );
}

/** Mark + divider + name, used in the header and footer */
export function Logo({ subtitle }: { subtitle?: string }) {
  return (
    <Link href="/" className="group flex items-center gap-4 text-accent" aria-label={`${site.name} — home`}>
      <LogoMark className="size-9 shrink-0 transition-transform duration-300 group-hover:scale-105 sm:size-10" />
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
