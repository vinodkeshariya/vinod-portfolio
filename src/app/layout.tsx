import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCta } from "@/components/MobileCta";
import { RevealRoot } from "@/components/RevealRoot";
import { site } from "@/lib/data";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Vinod Keshariya | AI + Next.js Developer",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "AI-Powered Full-Stack Developer", "AI Developer", "Claude Code Developer", "Next.js Developer",
    "AI Integration Developer", "React Developer", "AI Web Application Development", "MCP Developer",
    "Sanity CMS Developer", "WordPress to Next.js Migration",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    url: "/",
    title: "Vinod Keshariya | AI + Next.js Developer",
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} — ${site.role}` }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
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
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileCta />
        <RevealRoot />
      </body>
    </html>
  );
}
