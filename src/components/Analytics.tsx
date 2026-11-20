"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Which links count as a contact action */
function contactMethod(href: string) {
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "phone";
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return "whatsapp";
  return null;
}

/**
 * Google Analytics 4 (gtag.js).
 * - Page views (including client-side navigation), scrolls, outbound clicks and résumé
 *   downloads come from GA's Enhanced Measurement — no code needed.
 * - Adds a `contact_click` event for email / WhatsApp / phone links.
 * - Open any page with `?notrack=1` to stop counting your own visits in this browser
 *   (`?notrack=0` turns counting back on).
 */
export function Analytics({ gaId }: { gaId: string }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const method = link && contactMethod(link.getAttribute("href") ?? "");
      if (method) track("contact_click", { method, page: location.pathname });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`try{var q=new URLSearchParams(location.search).get('notrack');if(q==='1')localStorage.setItem('ga-optout','1');if(q==='0')localStorage.removeItem('ga-optout');if(localStorage.getItem('ga-optout'))window['ga-disable-${gaId}']=true}catch(e){}
window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
    </>
  );
}
