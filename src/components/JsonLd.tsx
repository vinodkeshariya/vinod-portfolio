import { certifications, experience, hasUpwork, site, skillCards } from "@/lib/data";

/** Renders schema.org structured data. `<` is escaped so the payload can't close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const abs = (path: string) => (path.startsWith("http") ? path : `${site.url}${path}`);

/** Short reference to the site owner, for use inside other entities */
export const personRef = { "@type": "Person", name: site.name, url: site.url } as const;

/** Full Person entity (About page) — built only from facts already shown on the site */
export function personLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: site.role,
    image: abs("/images/vinod-photo.webp"),
    description: site.description,
    email: `mailto:${site.email}`,
    telephone: site.phone.replace(/\s/g, ""),
    address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressRegion: "Gujarat", addressCountry: "IN" },
    worksFor: { "@type": "Organization", name: experience.company },
    knowsLanguage: site.languages.map((l) => l.split(" — ")[0]),
    knowsAbout: [...new Set(skillCards.flatMap((g) => g.items))],
    hasCredential: certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.title,
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: c.issuer },
    })),
    sameAs: [site.socials.linkedin, site.socials.github, ...(hasUpwork ? [site.socials.upwork] : [])],
  };
}
