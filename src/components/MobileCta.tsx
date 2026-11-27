"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

/** Sticky bottom call-to-action on small screens, shown after the first screen of scrolling */
/** `labels`: title, text and button from the CMS (Site settings → Menu, footer & 404) */
export function MobileCta({ labels }: { labels: { title: string; text: string; button: string } }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 520;
      setShow(window.scrollY > window.innerHeight * 0.8 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname === "/contact") return null;

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 transition duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-night p-2 pl-4 text-white shadow-(--shadow-float) backdrop-blur">
        <span className="dot dot-live" />
        <span className="flex-1 text-[13px] leading-tight">
          <strong className="block font-semibold">{labels.title}</strong>
          <span className="text-white/60">{labels.text}</span>
        </span>
        <Link href="/contact" className="btn btn-lime btn-sm" tabIndex={show ? 0 : -1}>
          {labels.button} <Icon name="arrow" />
        </Link>
      </div>
    </div>
  );
}
