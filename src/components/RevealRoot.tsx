"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Enables scroll-reveal for any element with `data-reveal`.
 * Content stays visible without JS; animation is a progressive enhancement.
 * Optional `data-delay="120"` (ms) staggers items.
 */
export function RevealRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (!document.documentElement.classList.contains("js-reveal")) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => {
      if (el.dataset.delay) el.style.transitionDelay = `${el.dataset.delay}ms`;
      io.observe(el);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
