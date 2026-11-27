import type { Metadata, Viewport } from "next";
import { Assistant } from "@/components/Assistant";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCta } from "@/components/MobileCta";
import { RevealRoot } from "@/components/RevealRoot";
import { Analytics } from "@/components/Analytics";
import { whatsappLink } from "@/lib/assistant";
import { toList } from "@/lib/blog-check";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/data";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { site, google, texts } = await getContent();
  const { seo } = texts.layout;
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seo.title,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: toList(seo.keywords),
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    openGraph: {
      type: "website",
      siteName: site.name,
      url: "/",
      title: seo.title,
      description: site.description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${site.name} — ${site.role}` }],
    },
    twitter: { card: "summary_large_image", images: ["/og-image.png"] },
    ...(google.searchConsole && { verification: { google: google.searchConsole } }),
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { site, google, menu, texts } = await getContent();
  /** Analytics runs only on the live Vercel site — not on localhost, preview deploys or the old Netlify copy */
  const gaId = /^G-[A-Z0-9]+$/.test(google.gaId) && process.env.VERCEL_ENV === "production" ? google.gaId : null;

  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Enable reveal animations before first paint to avoid a flash of content */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-reveal')",
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Header name={site.name} menu={menu} />
        <main id="main">{children}</main>
        <Footer />
        <MobileCta labels={texts.layout.mobileBar} />
        <Assistant whatsapp={whatsappLink(site)} />
        <RevealRoot />
        {gaId && <Analytics gaId={gaId} />}
      </body>
    </html>
  );
}
