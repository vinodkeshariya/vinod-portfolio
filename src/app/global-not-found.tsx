import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/data";
import { fontVariables } from "@/lib/fonts";
import NotFound from "./(frontend)/not-found";
import "./(frontend)/globals.css";

/**
 * 404 for URLs that match no route. The site and the Payload admin have separate root layouts,
 * so this page brings its own <html>, header and footer — it looks the same as the site's 404.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `Page not found | ${site.name}`,
  description: "The page you're looking for doesn't exist or has moved.",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <Header />
        <main id="main">
          <NotFound />
        </main>
        <Footer />
      </body>
    </html>
  );
}
