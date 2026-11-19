// Single source of truth for site content.
// Values in [BRACKETS] are placeholders for Vinod to replace with real details
// (email, phone and social links).

export const site = {
  name: "Vinod Keshariya",
  initials: "VK",
  role: "AI-Powered Next.js Developer",
  short: "Next.js + Sanity Developer",
  location: "Ahmedabad, Gujarat, India",
  company: "Krushna53",
  since: "June 2023",
  url: "https://example.com", // [REPLACE] with the live domain
  email: "[hello@yourdomain.com]",
  phone: "[+91 phone number]",
  description:
    "AI-powered Next.js developer in Ahmedabad. Figma and WordPress to Next.js + Sanity CMS — fast websites your team can edit without code.",
  languages: ["English — Fluent", "Gujarati — Native", "Hindi — Conversational"],
  socials: {
    linkedin: "#",
    github: "#",
    upwork: "#",
    whatsapp: "#",
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
] as const;

export const stats = [
  { label: "Professional experience", value: "3+ yrs" },
  { label: "Average response time", value: "0–4 hrs" },
  { label: "Availability", value: "30+ hrs/wk" },
  { label: "Core stack", value: "Next.js + Sanity" },
];

/** Tools shown as chips under the hero */
export const toolkit = ["Next.js", "React", "Sanity CMS", "TypeScript", "Tailwind CSS", "WordPress", "Vercel", "Figma", "Claude Code", "MCP"];

/** Common website problems the home page addresses */
export const problems = [
  { title: "Pages load slowly.", text: "Heavy themes and plugins drag down Core Web Vitals — and your search rankings with them." },
  { title: "Updates feel risky.", text: "Plugins need constant updating, and each one is another security worry." },
  { title: "Content changes wait on a developer.", text: "Your team should be able to edit pages, images and blog posts on its own." },
];

/** Three headline services shown on the home page */
export const featuredServices = [
  {
    title: "Figma to Next.js + Sanity",
    text: "Pixel-perfect, responsive websites where your team edits every page, image and blog post without touching code.",
    points: ["Figma frames turned into reusable components", "Sanity Studio set up around your content", "Hosted on Vercel, scales automatically"],
    outcome: "Your design, live — and fully editable.",
    tag: "Figma",
    icon: "pen" as IconName,
  },
  {
    title: "WordPress → Next.js migration",
    text: "Move your content, keep your SEO and URLs, and get a website that loads in a fraction of the time.",
    points: ["Pages, posts, images and categories moved to Sanity", "Same URLs, with redirects where anything changes", "No more plugin updates or security patches"],
    outcome: "Same content, a much faster site.",
    tag: "Migration",
    icon: "layers" as IconName,
  },
  {
    title: "Next.js landing pages",
    text: "Landing pages and marketing sites built for speed, SEO and conversions.",
    points: ["Metadata, sitemap and social previews included", "Optimised images and fonts for fast loading", "Contact forms and analytics connected"],
    outcome: "A launch-ready page in days.",
    tag: "Landing page",
    icon: "bolt" as IconName,
  },
];

/** AI-assisted workflow points */
export const aiWorkflow = {
  tools: ["Claude", "Claude Code", "MCP", "ChatGPT", "Cursor"],
  points: [
    { title: "Figma → components, faster", text: "AI drafts components, Sanity schemas and migration scripts — so I deliver in days what usually takes weeks." },
    { title: "Every line reviewed", text: "I review every component myself and test on real devices and browsers before delivery." },
    { title: "AI features with MCP", text: "I also build AI into websites with Claude and MCP — for example, an assistant that answers from your own content." },
  ],
};

/** Skill cards with chips (home + about) */
export const skillCards: { title: string; icon: IconName; items: string[] }[] = [
  { title: "Frontend", icon: "code", items: ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML / CSS"] },
  { title: "CMS & platforms", icon: "layers", items: ["Sanity CMS", "WordPress", "Elementor", "Vercel", "Git"] },
  { title: "Design handoff", icon: "pen", items: ["Figma", "PSD to CMS", "Responsive design", "Pixel-perfect QA"] },
  { title: "AI development", icon: "spark", items: ["Claude", "Claude Code", "MCP", "AI integration", "Content migration"] },
];

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type GalleryItem = { src: string; alt: string; device: "desktop" | "mobile" };

export type ProjectFilter = "nextjs" | "migration" | "landing" | "wordpress" | "ecommerce";

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  filters: ProjectFilter[];
  role: string;
  stack: string;
  year: string;
  summary: string;
  tagline: string;
  tags: string[];
  cover: string;
  overview: string;
  challenge: string;
  approach: string;
  features: string[];
  tech: string[];
  gallery: GalleryItem[];
  ctaTitle: string;
  ctaText: string;
  /** Soft background colour behind the device mockups */
  tint: string;
};

const img = (slug: string, file: string) => `/images/projects/${slug}/${file}.webp`;

export const projects: Project[] = [
  {
    slug: "fashion-catalog",
    tint: "#edeae0",
    title: "Fashion E-commerce Store",
    client: "Aurelle — concept brand",
    category: "Next.js + Sanity",
    filters: ["nextjs", "ecommerce"],
    role: "Design build & CMS",
    stack: "Next.js, Sanity, Tailwind",
    year: "2025",
    summary: "An editorial fashion storefront with a Sanity-powered product catalog the brand team updates themselves.",
    tagline: "A premium storefront with a product catalog the merchant edits in Sanity Studio.",
    tags: ["Next.js", "Sanity", "Tailwind CSS", "Vercel"],
    cover: img("fashion-catalog", "cover"),
    overview:
      "A fashion storefront built with Next.js and Sanity CMS. Products, collections, lookbooks and homepage sections all live in Sanity, so the brand team can launch a new drop without a developer.",
    challenge:
      "Fashion sites need large, beautiful imagery without sacrificing speed. The catalog also had to be easy to manage: new products, colours, sizes and seasonal campaigns every few weeks.",
    approach:
      "I modelled products, variants and collections as Sanity schemas, and built the storefront from reusable Next.js components. Images are served through the Sanity image pipeline with responsive sizes, and pages are statically generated with on-demand revalidation when content changes.",
    features: [
      "Sanity schemas for products, variants and collections",
      "Editable homepage sections and lookbooks",
      "Responsive images via the Sanity image pipeline",
      "Static generation with on-demand revalidation",
      "Mobile-first product and cart experience",
      "Deployed on Vercel with preview links",
    ],
    tech: ["Next.js", "Sanity CMS", "TypeScript", "Tailwind CSS", "Vercel"],
    gallery: [
      { src: img("fashion-catalog", "shop"), alt: "Collection page with product grid and filters", device: "desktop" },
      { src: img("fashion-catalog", "product"), alt: "Product page with gallery, colour and size selection", device: "desktop" },
      { src: img("fashion-catalog", "mobile-1"), alt: "Mobile homepage hero", device: "mobile" },
      { src: img("fashion-catalog", "mobile-2"), alt: "Mobile cart drawer with free-shipping progress", device: "mobile" },
    ],
    ctaTitle: "Need a store your team can run?",
    ctaText: "I build fast Next.js storefronts with a catalog you manage in Sanity.",
  },
  {
    slug: "ai-saas-landing",
    tint: "#f0f1ea",
    title: "AI SaaS Landing Page",
    client: "Lumen Analytics — concept brand",
    category: "Figma → Next.js",
    filters: ["nextjs", "landing"],
    role: "Frontend development",
    stack: "Next.js, Tailwind CSS",
    year: "2025",
    summary: "A high-fidelity Figma design turned into a fast, responsive Next.js landing page for an AI analytics product.",
    tagline: "Absolute design fidelity, clean components and excellent responsive behaviour.",
    tags: ["Next.js", "Tailwind CSS", "Figma", "Responsive"],
    cover: img("ai-saas-landing", "cover"),
    overview:
      "A pixel-perfect conversion of a Figma design into a production Next.js landing page — hero, product preview, features, pricing and FAQ — built for speed and conversions.",
    challenge:
      "SaaS landing pages must match the design system exactly while staying lightweight. Small spacing or typography drift quickly undermines the brand and the conversion path.",
    approach:
      "I translated the Figma variables into Tailwind tokens first, then built each section as a reusable component. Motion is subtle and purposeful, images are optimised with next/image, and every breakpoint was checked against the design.",
    features: [
      "Pixel-accurate build of the Figma design",
      "Design tokens mapped to Tailwind config",
      "Reusable section components",
      "Pricing toggle and FAQ accordion",
      "SEO metadata and OG images",
      "Strong Core Web Vitals",
    ],
    tech: ["Next.js", "React", "Tailwind CSS", "Figma", "Vercel"],
    gallery: [
      { src: img("ai-saas-landing", "features"), alt: "Feature grid with AI insights card", device: "desktop" },
      { src: img("ai-saas-landing", "mobile-1"), alt: "Mobile hero with dashboard preview", device: "mobile" },
      { src: img("ai-saas-landing", "mobile-2"), alt: "Mobile pricing with plan toggle", device: "mobile" },
    ],
    ctaTitle: "Have a Figma design ready?",
    ctaText: "Send it over — I'll reply with a plan, timeline and quote.",
  },
  {
    slug: "blog-migration",
    tint: "#edeae0",
    title: "WordPress Blog Migration",
    client: "Field Notes — concept publication",
    category: "WordPress → Next.js + Sanity",
    filters: ["migration", "nextjs"],
    role: "Migration & development",
    stack: "Next.js, Sanity, WordPress",
    year: "2025",
    summary: "A content-heavy WordPress blog moved to Next.js + Sanity — every post, image and URL kept, SEO intact.",
    tagline: "Hundreds of posts moved by script, same URLs, much faster pages.",
    tags: ["Migration", "Next.js", "Sanity", "SEO"],
    cover: img("blog-migration", "cover"),
    overview:
      "A long-running blog on WordPress was slow, plugin-heavy and hard to maintain. I migrated it to Next.js with Sanity CMS — posts, categories, authors and images — while keeping every URL and its rankings.",
    challenge:
      "Years of posts, mixed formatting from different editors, and dozens of plugins. Search traffic was the main source of readers, so not a single URL or ranking could be lost in the move.",
    approach:
      "I exported the WordPress content and wrote migration scripts that convert posts to Sanity Portable Text, upload images, and link authors and categories. A redirect map covers every old URL, and metadata, sitemaps and structured data are generated from Sanity.",
    features: [
      "Scripted migration of posts, authors and images",
      "HTML converted to Sanity Portable Text",
      "Full 301 redirect map — no lost URLs",
      "Category and author archive pages",
      "Sitemap, metadata and structured data",
      "Sanity Studio walkthrough for editors",
    ],
    tech: ["Next.js", "Sanity CMS", "WordPress", "TypeScript", "Vercel"],
    gallery: [
      { src: img("blog-migration", "post"), alt: "Article page with clean reading layout", device: "desktop" },
      { src: img("blog-migration", "mobile-1"), alt: "Mobile blog home", device: "mobile" },
      { src: img("blog-migration", "mobile-2"), alt: "Mobile article page", device: "mobile" },
    ],
    ctaTitle: "Stuck on a slow WordPress site?",
    ctaText: "Send me the link — I'll tell you how a move to Next.js + Sanity would work.",
  },
  {
    slug: "creative-agency",
    tint: "#f0f1ea",
    title: "Creative Agency Website",
    client: "Northwind Studio — concept agency",
    category: "Figma → Next.js + Sanity",
    filters: ["nextjs"],
    role: "Design build & CMS",
    stack: "Next.js, Sanity, Tailwind",
    year: "2025",
    summary: "A bold agency site with case studies, services and team pages — all editable in Sanity Studio.",
    tagline: "Big type, bold layouts, and case studies the team publishes themselves.",
    tags: ["Next.js", "Sanity", "Figma", "Animation"],
    cover: img("creative-agency", "cover"),
    overview:
      "A portfolio website for a creative studio, built from their Figma design. Case studies, services, team members and open roles are managed in Sanity, with a flexible page builder for new landing pages.",
    challenge:
      "Agency sites live and die by their visuals — large type, full-bleed imagery and motion — but they still need to be fast and simple to update between busy client projects.",
    approach:
      "I built a library of Sanity page-builder blocks matched one-to-one with Figma components, so the team composes new pages from the same building blocks. Motion is CSS-first and respects reduced-motion settings.",
    features: [
      "Page builder blocks matched to Figma components",
      "Case study template with rich media",
      "Services, team and careers pages",
      "Smooth, accessible motion",
      "Draft previews before publishing",
      "SEO fields on every page",
    ],
    tech: ["Next.js", "Sanity CMS", "TypeScript", "Tailwind CSS", "Vercel"],
    gallery: [
      { src: img("creative-agency", "work"), alt: "Selected work grid with case study cards", device: "desktop" },
      { src: img("creative-agency", "mobile-1"), alt: "Mobile hero", device: "mobile" },
      { src: img("creative-agency", "mobile-2"), alt: "Mobile case study list", device: "mobile" },
    ],
    ctaTitle: "Need a site that matches your brand?",
    ctaText: "Send me your Figma file and I'll reply with a clear plan.",
  },
  {
    slug: "restaurant-menu",
    tint: "#edeae0",
    title: "Restaurant Website with Editable Menu",
    client: "Saffron & Salt — concept restaurant",
    category: "Next.js + Sanity",
    filters: ["nextjs"],
    role: "Development & CMS",
    stack: "Next.js, Sanity, Tailwind",
    year: "2025",
    summary: "A warm restaurant website where staff update dishes, prices and specials in Sanity in seconds.",
    tagline: "The menu changes daily — now the website does too, without a developer.",
    tags: ["Next.js", "Sanity", "Responsive", "Local SEO"],
    cover: img("restaurant-menu", "cover"),
    overview:
      "A restaurant website with menu, specials, gallery and reservations. The menu is fully managed in Sanity — categories, dishes, prices, dietary tags and sold-out flags — and updates on the live site instantly.",
    challenge:
      "The old site had the menu as a PDF that nobody updated. Guests saw wrong prices and missing dishes, and most visits came from phones on the way to the restaurant.",
    approach:
      "I modelled the menu in Sanity with simple fields staff can understand, and built a mobile-first site around it. Pages revalidate on publish, and local SEO is covered with structured data, opening hours and a fast map embed.",
    features: [
      "Menu, prices and specials editable in Sanity",
      "Dietary tags and sold-out toggles",
      "Mobile-first menu with sticky categories",
      "Reservations call-to-action",
      "Restaurant structured data for local SEO",
      "Instant updates on publish",
    ],
    tech: ["Next.js", "Sanity CMS", "TypeScript", "Tailwind CSS", "Vercel"],
    gallery: [
      { src: img("restaurant-menu", "menu"), alt: "Menu page with categories and dishes", device: "desktop" },
      { src: img("restaurant-menu", "studio"), alt: "Content studio editing a menu item", device: "desktop" },
      { src: img("restaurant-menu", "mobile-1"), alt: "Mobile hero", device: "mobile" },
      { src: img("restaurant-menu", "mobile-2"), alt: "Mobile menu with category tabs", device: "mobile" },
    ],
    ctaTitle: "Want a site you can update yourself?",
    ctaText: "I'll set up Sanity so your team edits content in minutes.",
  },
  {
    slug: "business-wordpress",
    tint: "#f0f1ea",
    title: "Business Website on WordPress",
    client: "Meridian Builders — concept company",
    category: "PSD → WordPress + Elementor",
    filters: ["wordpress"],
    role: "WordPress development",
    stack: "WordPress, Elementor, PHP",
    year: "2024",
    summary: "A PSD design turned into a responsive WordPress + Elementor site for a construction company.",
    tagline: "A professional company website the team edits with Elementor.",
    tags: ["WordPress", "Elementor", "PSD to CMS", "Speed"],
    cover: img("business-wordpress", "cover"),
    overview:
      "A multi-page business website for a construction company — services, projects, about and contact — built in WordPress with Elementor from a PSD design, optimised for speed and mobile.",
    challenge:
      "The company needed a credible, modern site quickly, and wanted to keep editing in the WordPress dashboard they already knew.",
    approach:
      "I built a lean Elementor setup with global colours, fonts and reusable templates matched to the PSD, kept plugins to a minimum, and tuned images, caching and fonts for fast loading.",
    features: [
      "Pixel-accurate build of the PSD design",
      "Global styles and reusable templates",
      "Projects portfolio with filters",
      "Quote request form",
      "Speed and mobile optimisation",
      "On-page SEO setup",
    ],
    tech: ["WordPress", "Elementor", "PHP", "CSS", "Responsive Design"],
    gallery: [
      { src: img("business-wordpress", "services"), alt: "Services section with project highlights", device: "desktop" },
      { src: img("business-wordpress", "mobile-1"), alt: "Mobile hero", device: "mobile" },
      { src: img("business-wordpress", "mobile-2"), alt: "Mobile quote form", device: "mobile" },
    ],
    ctaTitle: "Prefer to stay on WordPress?",
    ctaText: "I build clean, fast WordPress and Elementor sites too.",
  },
];

export const projectFilters = [
  { id: "all", label: "All" },
  { id: "nextjs", label: "Next.js + Sanity" },
  { id: "migration", label: "Migration" },
  { id: "landing", label: "Landing pages" },
  { id: "wordpress", label: "WordPress" },
  { id: "ecommerce", label: "E-commerce" },
] as const;

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export type IconName =
  | "browser" | "react" | "cart" | "store" | "pen" | "spark" | "bolt" | "code"
  | "layers" | "shield" | "clock" | "check" | "award" | "mail" | "chat" | "pin" | "arrow" | "arrowUpRight"
  | "download" | "send" | "linkedin" | "github" | "upwork" | "menu" | "close" | "star" | "camera" | "users";

export const services: {
  title: string; short: string; body: string; tags: string[]; icon: IconName;
  image: string; imageAlt: string; points: string[];
}[] = [
  {
    title: "Figma to Next.js + Sanity CMS",
    image: "/images/projects/creative-agency/cover.webp",
    imageAlt: "Agency website built from a Figma design",
    points: ["Figma frames turned into reusable components", "Sanity Studio with page-builder blocks", "Deployed on Vercel with preview links"],
    short: "Pixel-perfect websites your team can edit without code.",
    body: "Your Figma design turned into a fast, responsive Next.js website with Sanity CMS — every page, image and blog post editable from a clean dashboard.",
    tags: ["Next.js", "Sanity", "Tailwind", "Figma"],
    icon: "pen",
  },
  {
    title: "WordPress to Next.js Migration",
    image: "/images/projects/blog-migration/cover.webp",
    imageAlt: "Blog migrated from WordPress to Next.js",
    points: ["Pages, posts and images moved by script", "Every old URL kept or redirected", "Editors trained on Sanity Studio"],
    short: "Keep your content, URLs and SEO. Lose the plugin chaos.",
    body: "Pages, posts, images and categories moved into Sanity by script, the same URLs with proper redirects, and a website that loads in a fraction of the time.",
    tags: ["Migration", "Next.js", "Sanity", "SEO"],
    icon: "layers",
  },
  {
    title: "Next.js Landing Pages",
    image: "/images/projects/ai-saas-landing/cover.webp",
    imageAlt: "SaaS landing page built with Next.js",
    points: ["Pixel-perfect from your design", "Metadata, sitemap and social previews", "Forms and analytics connected"],
    short: "Marketing sites built for speed, SEO and conversions.",
    body: "Landing pages and marketing sites with SEO built in, strong Core Web Vitals, and forms, analytics and integrations wired up.",
    tags: ["Next.js", "React", "SEO", "Vercel"],
    icon: "bolt",
  },
  {
    title: "Add Sanity CMS to Next.js",
    image: "/images/projects/restaurant-menu/studio.webp",
    imageAlt: "Content studio editing a menu item",
    points: ["Content schemas for your pages", "Live preview while editing", "Publish updates in seconds"],
    short: "Make your existing Next.js site editable.",
    body: "Content schemas, Sanity Studio and live preview added to your existing Next.js website, so your team stops waiting on developers for text and image changes.",
    tags: ["Sanity", "Next.js", "TypeScript"],
    icon: "code",
  },
  {
    title: "WordPress & Elementor Websites",
    image: "/images/projects/business-wordpress/cover.webp",
    imageAlt: "Business website built with WordPress and Elementor",
    points: ["Global styles and reusable templates", "Lean plugin setup for speed", "On-page SEO configured"],
    short: "Business websites your team manages in WordPress.",
    body: "Custom WordPress and Elementor websites from PSD or Figma — lean setup, global styles, speed and mobile optimisation, and on-page SEO.",
    tags: ["WordPress", "Elementor", "PHP", "PSD to CMS"],
    icon: "browser",
  },
  {
    title: "Figma / PSD to HTML & Tailwind",
    image: "/images/projects/fashion-catalog/cover.webp",
    imageAlt: "Fashion storefront converted from design to code",
    points: ["Semantic, accessible HTML", "Tailwind CSS matched to your tokens", "Checked on every breakpoint"],
    short: "Clean, responsive code from your design.",
    body: "High-fidelity designs translated into semantic HTML and Tailwind CSS with careful attention to spacing, typography and every breakpoint.",
    tags: ["HTML", "CSS", "Tailwind", "Responsive"],
    icon: "react",
  },
  {
    title: "AI Integration",
    image: "/images/services/ai-assistant.webp",
    imageAlt: "Help center with an AI assistant answering from articles",
    points: ["Assistant trained on your own content", "Built with Claude and MCP", "Clear fallbacks and error handling"],
    short: "Chat assistants, smart search and content helpers.",
    body: "AI features built into your website with Claude and MCP — assistants that answer from your content, smart search and editorial helpers, with reliable error handling.",
    tags: ["Claude", "MCP", "AI Development", "APIs"],
    icon: "spark",
  },
];

export const packages = [
  {
    name: "Quick start",
    title: "Landing Page",
    text: "One high-converting page in Next.js, React or WordPress, from your design.",
    points: ["Responsive, pixel-perfect build", "SEO and speed setup", "Contact form & analytics"],
    price: "Fixed quote",
    featured: false,
  },
  {
    name: "Most popular",
    title: "Next.js + Sanity Website",
    text: "A multi-page website or WordPress migration your team edits in Sanity.",
    points: ["Custom pages & components", "Sanity Studio for your content", "SEO, redirects & Core Web Vitals"],
    price: "Fixed quote",
    featured: true,
  },
  {
    name: "Ongoing",
    title: "Monthly Support",
    text: "A dedicated developer for updates, new features and speed care.",
    points: ["Reserved hours each month", "Priority response", "Bug fixes & improvements"],
    price: "Monthly retainer",
    featured: false,
  },
];

export const process = [
  { title: "Share your project", text: "Send your Figma file or current website link, with a few lines about your goals." },
  { title: "Plan & fixed quote", text: "I reply with a clear plan, timeline and fixed quote — work starts only once you agree." },
  { title: "Build & preview", text: "You follow progress on a live preview link and give feedback as pages come together." },
  { title: "Test & launch", text: "Every page is tested on real devices and browsers, then deployed with SEO and redirects checked." },
];

/* ------------------------------------------------------------------ */
/* About / experience                                                  */
/* ------------------------------------------------------------------ */

export const principles: { title: string; text: string; icon: IconName }[] = [
  { title: "Editable by your team", text: "A website should never need a developer to change a headline or publish a post.", icon: "users" },
  { title: "Performance is a feature", text: "Fast load times and good Core Web Vitals are non-negotiable for real users.", icon: "bolt" },
  { title: "Design fidelity", text: "What ships should look exactly like the Figma file, on every screen size.", icon: "pen" },
  { title: "AI speed, human quality", text: "AI speeds up the work; every component is reviewed and tested by me.", icon: "spark" },
];

export const experience = {
  role: "Full Stack Developer",
  company: "Krushna53",
  place: "Ahmedabad",
  period: "June 2023 – Present",
  summary: "Building, migrating and maintaining client websites with Next.js, Sanity CMS and WordPress.",
  points: [
    "Convert Figma and PSD designs into fast, responsive Next.js websites with Sanity CMS",
    "Set up Sanity CMS: content schemas, Sanity Studio and editable pages, images and posts",
    "Migrate WordPress websites to Next.js + Sanity, keeping content, URLs and SEO intact",
    "Build and customise WordPress websites for clients",
    "Maintain live client websites: updates, bug fixes, speed improvements and new features",
    "Use AI tools like Claude to speed up development, content migration and testing",
  ],
  tags: ["Next.js", "React", "Sanity", "TypeScript", "Tailwind CSS", "WordPress", "PHP", "Figma", "Vercel", "Git", "Claude"],
};

export const education = {
  degree: "B.A. Geography",
  school: "Gujarat University",
  period: "2018 – 2020",
  text: "A structured way of thinking about systems and relationships — now applied to content models, component architecture and information hierarchy.",
};

export const certifications = [
  { date: "June 2025", issuer: "WP Academy", title: "WordPress eCommerce Development", text: "Store architecture, WooCommerce customisation and payments." },
  { date: "February 2025", issuer: "Udemy", title: "Next.js", text: "App Router, data fetching, rendering strategies and deployment." },
  { date: "January 2025", issuer: "Udemy", title: "Full Stack Developer", text: "Frontend, backend and APIs — building complete web applications." },
  { date: "November 2024", issuer: "Udemy", title: "Frontend (React & Next.js)", text: "Modern React patterns, components and Next.js fundamentals." },
  { date: "August 2024", issuer: "Udemy", title: "Figma to HTML, CSS & JavaScript", text: "Translating design files into accurate, responsive code." },
];

/* ------------------------------------------------------------------ */
/* Social proof / FAQ                                                  */
/* ------------------------------------------------------------------ */

/**
 * Client reviews. Add real ones here — the "Client reviews" section on the
 * home page appears automatically as soon as this list has entries.
 * Example: { quote: "…", name: "Jane D.", meta: "Next.js website · UK", initials: "JD" }
 */
export const testimonials: { quote: string; name: string; meta: string; initials: string }[] = [];

export const faqs = [
  { q: "Will my SEO survive a WordPress to Next.js migration?", a: "Yes. I keep your existing URLs, add redirects for anything that has to change, and carry over titles, descriptions and structured data — so search engines see the same site, only faster." },
  { q: "Who updates the content after launch?", a: "Your team does. Sanity Studio gives you a clean dashboard for pages, images and blog posts, and I show you how everything works before handover." },
  { q: "Why Next.js + Sanity instead of WordPress?", a: "Much faster page loads and better Core Web Vitals, no plugin updates, fewer security issues, and hosting on Vercel that scales automatically. If WordPress suits you better, I build that too." },
  { q: "How long does a project take?", a: "A landing page usually takes a few days. A full website or migration takes 1–4 weeks depending on pages and content. You get a clear timeline before any work starts." },
  { q: "How do you use AI in your work?", a: "Claude and Claude Code help me turn Figma designs into components, write Sanity schemas, migrate content and test. I review every component myself and test on real devices and browsers." },
  { q: "What do you need from me to start?", a: "Your Figma file or current website link, and a short note about your goals. I'll come back with a plan, timeline and fixed quote." },
];

export const projectTypes = [
  "Figma to Next.js + Sanity", "WordPress to Next.js migration", "Next.js landing page", "Add Sanity to Next.js",
  "WordPress / Elementor", "Figma / PSD to HTML", "AI integration", "Other",
];

export const budgets = [
  "Under $500", "$500 – $1,500", "$1,500 – $3,000", "$3,000+", "Prefer to discuss",
];
