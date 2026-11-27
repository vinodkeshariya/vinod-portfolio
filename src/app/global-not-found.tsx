import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/data";
import { fontVariables } from "@/lib/fonts";
import NotFound from "./(frontend)/not-found";
import "./(frontend)/globals.css";

/**
 * 404 for URLs that match no route. The site and the Payload admin have separate root layouts,
 * so this page brings its own <html>, header and footer — it looks the same as the site's 404.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
    metadataBase: new URL(siteUrl),
    title: `Page not found | ${site.name}`,
    description: "The page you're looking for doesn't exist or has moved.",
    robots: { index: false },
  };
}

export default async function GlobalNotFound() {
  const { site, menu } = await getContent();
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <Header name={site.name} menu={menu} />
        <main id="main">
          <NotFound />
        </main>
        <Footer />
      </body>
    </html>
  );
}
