# Vinod Keshariya — Portfolio

Personal portfolio of Vinod Keshariya, an AI-powered Next.js + Sanity developer. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** and **Tailwind CSS v4**, in a "Modern Editorial" style (forest green, warm ivory, soft lime).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Where things live

| Path | What |
|---|---|
| `src/lib/data.ts` | **All site content**: name, contact details, projects, services, skills, experience, FAQ, testimonials |
| `src/app/globals.css` | Design tokens (`@theme`: colors, fonts, shadows) and shared classes (`.btn`, `.card`, `.eyebrow`…) |
| `src/app/**/page.tsx` | Pages: home, about, services, projects, projects/[slug], experience, contact, hire-me |
| `src/components/` | Header, Footer, ProjectCard, ProjectGrid (filters), ContactForm, Faq, HeroVisual, ImageStack, shared UI |
| `public/images/` | Project screenshots (`projects/<slug>/…`) and service images |
| `public/og.png` | Social share image (1200×630) |

## Before going live — replace the placeholders

In `src/lib/data.ts`:

- `site.url`, `site.email`, `site.phone` and `site.socials.*`
- `testimonials`: add real client quotes only (the home page section appears once this list has entries)

The "Download résumé" buttons link to `#` until a PDF is added.

## Images

The project images are screenshots of **concept websites** created for this portfolio, not real client sites.
To replace them, keep the same file names in `public/images/projects/<slug>/` (desktop 1440×900, mobile 780×1688)
or update the paths in `src/lib/data.ts`.
