// Single source of truth for site content.
// Update text here rather than in the page components.

export const site = {
  name: "Vinod Keshariya",
  initials: "VK",
  role: "AI-Powered Full-Stack Developer",
  short: "AI + Next.js Specialist",
  location: "Ahmedabad, Gujarat, India",
  company: "Krushna53",
  since: "June 2023",
  url: "https://vinodkeshariya.vercel.app",
  email: "keshariyavinod793@gmail.com",
  phone: "+91 92651 21783",
  resume: "/Vinod_Keshariya_Frontend_Developer.pdf",
  availability: "Open for freelance projects worldwide",
  hours: "30+ hours/week",
  tagline:
    "Building intelligent web experiences and modern digital products using AI-powered development workflows and modern web technologies.",
  description:
    "Vinod Keshariya is an AI-powered Full-Stack Developer specializing in Claude Code, AI integrations, Next.js, React, Sanity CMS, and WordPress. Available for freelance projects worldwide.",
  languages: ["English — Fluent", "Gujarati — Native or Bilingual", "Hindi — Conversational"],
  socials: {
    linkedin: "https://www.linkedin.com/in/ahir-vinod-keshariya-a747562b2/",
    github: "https://github.com/vinodkeshariya",
    upwork: "#", // add the Upwork profile URL to show the "Hire me on Upwork" buttons
    whatsapp: "https://wa.me/919265121783",
  },
} as const;

/** True once a real Upwork profile URL has been added */
export const hasUpwork = (site.socials.upwork as string) !== "#";

export const ext = (href: string) =>
  href.startsWith("http") ? ({ target: "_blank", rel: "noopener noreferrer" } as const) : {};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
] as const;

export const stats = [
  { label: "Experience", value: "3+ Years" },
  { label: "Availability", value: "30+ hrs/wk" },
  { label: "Response time", value: "0–4 hrs" },
  { label: "Core expertise", value: "AI + Next.js + React" },
];

/** Tools shown as chips under the hero */
export const toolkit = [
  "Claude", "Claude Code", "ChatGPT", "MCP", "Next.js", "React", "TypeScript",
  "Sanity CMS", "Tailwind CSS", "WordPress", "Elementor", "Vercel", "Figma", "Git",
];

/** Common challenges the home page addresses */
export const problems = [
  {
    title: "Slow and outdated websites.",
    text: "Heavy WordPress themes, unnecessary plugins, and unoptimized assets can affect loading speed and user experience.",
  },
  {
    title: "Difficult content management.",
    text: "Your team shouldn't need a developer for every small content change. Manage pages, images, and blog posts through a structured CMS.",
  },
  {
    title: "Repetitive development work.",
    text: "Manual coding and repetitive tasks can slow down projects. AI-assisted development helps accelerate component creation, debugging, and testing.",
  },
  {
    title: "Missing intelligent features.",
    text: "Modern websites can do more than display information. AI integrations can help users search, discover, and interact with your content.",
  },
];

/** Four headline services shown on the home page */
export const featuredServices = [
  {
    title: "AI Integration & Development",
    text: "Bring intelligent features into your website or application using AI APIs and modern development technologies.",
    points: ["AI assistants and chat interfaces", "AI-powered content experiences", "Claude API integrations", "Intelligent search and Q&A features", "AI API integration with Next.js"],
    tag: "AI",
    href: "/services#service-1",
    icon: "spark" as IconName,
  },
  {
    title: "Next.js & React Development",
    text: "Build modern, responsive, high-performance websites and web applications.",
    points: ["Custom Next.js development", "Reusable React components", "Responsive interfaces", "SEO-friendly architecture", "API integrations"],
    tag: "Next.js",
    href: "/services#service-3",
    icon: "code" as IconName,
  },
  {
    title: "Figma to Next.js + Sanity CMS",
    text: "Turn your Figma designs into pixel-perfect websites with a fully editable CMS.",
    points: ["Figma-to-code implementation", "Reusable components", "Sanity Studio setup", "Editable pages and content", "Responsive implementation"],
    tag: "Figma",
    href: "/services#service-4",
    icon: "pen" as IconName,
  },
  {
    title: "WordPress to Next.js Migration",
    text: "Modernize your WordPress website while protecting content and SEO.",
    points: ["Content and image migration", "Sanity CMS integration", "URL preservation and redirects", "Modern Next.js frontend", "SEO metadata migration"],
    tag: "Migration",
    href: "/services#service-5",
    icon: "layers" as IconName,
  },
];

/** Traditional WordPress vs. Next.js + Sanity (home, dark section) */
export const compare = [
  { k: "Performance", wp: "Heavy themes and plugins", nx: "Optimized frontend architecture" },
  { k: "Maintenance", wp: "Frequent plugin updates", nx: "Fewer plugin dependencies" },
  { k: "Architecture", wp: "Larger plugin dependency", nx: "Decoupled architecture" },
  { k: "Editing", wp: "Complex page-builder editing", nx: "Structured Sanity Studio" },
  { k: "Hosting", wp: "Traditional server management", nx: "Vercel deployment" },
];

/** AI-assisted development workflow */
export const aiWorkflow = {
  tools: ["Claude", "Claude Code", "ChatGPT", "MCP", "Cursor"],
  points: [
    { title: "AI-assisted planning & coding", text: "Use AI tools to understand requirements, plan features, generate React components, and accelerate repetitive development tasks." },
    { title: "Claude Code development", text: "Work with existing codebases, build Next.js features, create reusable components, write TypeScript code, and improve implementation workflows." },
    { title: "CMS & API workflows", text: "Accelerate Sanity schema creation, content modeling, API integrations, and website migration tasks." },
    { title: "Human review & testing", text: "Review generated code, debug issues, verify functionality, and test the final experience across browsers and devices." },
  ],
  closing: "AI accelerates the process. Engineering judgment ensures the quality.",
};

/** Skill groups with chips (about + experience) */
export const skillCards: { title: string; icon: IconName; items: string[] }[] = [
  { title: "AI & AI-assisted development", icon: "spark", items: ["Claude", "Claude Code", "ChatGPT", "MCP", "Cursor", "AI API Integration", "AI-Assisted Coding"] },
  { title: "Frontend", icon: "code", items: ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS"] },
  { title: "CMS", icon: "layers", items: ["Sanity CMS", "WordPress", "Elementor"] },
  { title: "Other technologies", icon: "pen", items: ["HTML", "CSS", "PHP", "Vercel", "Git", "Figma"] },
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
    category: "E-commerce Website",
    filters: ["nextjs", "ecommerce"],
    role: "Design build & CMS",
    stack: "Next.js, Sanity, Tailwind",
    year: "2025",
    summary: "An editorial-style fashion storefront with a structured product catalog powered by Sanity CMS, making it easy for the team to manage products and content.",
    tagline: "A premium storefront with a product catalog the merchant edits in Sanity Studio.",
    tags: ["Next.js", "Sanity CMS", "Tailwind CSS", "Vercel"],
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
    category: "AI Product Website",
    filters: ["nextjs", "landing"],
    role: "Frontend development",
    stack: "Next.js, Tailwind CSS",
    year: "2025",
    summary: "A modern, responsive landing page for an AI analytics product, translating a high-fidelity Figma design into a clean web experience.",
    tagline: "Absolute design fidelity, clean components and excellent responsive behaviour.",
    tags: ["Next.js", "Tailwind CSS", "Figma", "Responsive Design"],
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
      "Optimised images and fonts",
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
    category: "Website Migration",
    filters: ["migration", "nextjs"],
    role: "Migration & development",
    stack: "Next.js, Sanity, WordPress",
    year: "2025",
    summary: "A content-heavy WordPress website migrated to Next.js and Sanity CMS, with content, images, and URL structures carefully handled.",
    tagline: "Posts, images and authors moved by script, with the URL structure and SEO metadata carefully preserved.",
    tags: ["WordPress", "Next.js", "Sanity CMS", "SEO"],
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
    category: "Business Website",
    filters: ["nextjs"],
    role: "Design build & CMS",
    stack: "Next.js, Sanity, Tailwind",
    year: "2025",
    summary: "A modern agency website with editable content, service pages, and project presentations.",
    tagline: "Big type, bold layouts, and case studies the team publishes themselves.",
    tags: ["Next.js", "Sanity CMS", "Tailwind CSS"],
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
    category: "Restaurant Website",
    filters: ["nextjs"],
    role: "Development & CMS",
    stack: "Next.js, Sanity, Tailwind",
    year: "2025",
    summary: "A responsive restaurant website with CMS-managed menu items, dish descriptions, and pricing.",
    tagline: "The menu changes daily — now the website does too, without a developer.",
    tags: ["Next.js", "Sanity CMS", "Tailwind CSS"],
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
    category: "WordPress Development",
    filters: ["wordpress"],
    role: "WordPress development",
    stack: "WordPress, Elementor, PHP",
    year: "2024",
    summary: "A business website built from a PSD design using WordPress and Elementor.",
    tagline: "A professional company website the team edits with Elementor.",
    tags: ["WordPress", "Elementor", "HTML", "CSS"],
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
  | "download" | "send" | "linkedin" | "github" | "upwork" | "menu" | "close" | "star" | "camera" | "users"
  | "briefcase" | "monitor" | "cpu" | "cap" | "globe";

export const services: {
  title: string; short: string; body: string; tags: string[]; icon: IconName;
  image: string; imageAlt: string; points: string[]; tagsLabel?: string;
}[] = [
  {
    title: "AI Integration & Development",
    image: "/images/services/ai-assistant.webp",
    imageAlt: "Help center concept with an AI assistant answering questions",
    short: "Bring intelligent functionality into your website or application.",
    body: "Bring intelligent functionality into your website or application with AI APIs and modern development technologies.",
    points: ["Claude API integration", "AI chat interfaces", "AI-powered content assistants", "Context-aware Q&A features", "AI-powered search experiences", "AI API integration with Next.js"],
    tags: ["Next.js", "React", "TypeScript", "Claude API", "AI APIs"],
    icon: "spark",
  },
  {
    title: "Claude Code & AI-Assisted Development",
    image: "/images/services/ai-coding.webp",
    imageAlt: "Code editor with an AI coding assistant panel next to a React component",
    short: "Accelerate your development workflow using modern AI coding tools.",
    body: "Accelerate your development workflow using modern AI coding tools — with every change reviewed and tested by me.",
    points: ["Next.js feature development", "React component generation", "Codebase analysis", "Debugging and refactoring", "API integration assistance", "CMS schema development", "Development workflow improvements"],
    tags: ["Claude Code", "Claude", "ChatGPT", "Cursor"],
    tagsLabel: "Tools",
    icon: "code",
  },
  {
    title: "Next.js & React Development",
    image: "/images/projects/ai-saas-landing/cover.webp",
    imageAlt: "SaaS landing page built with Next.js",
    short: "Build fast, modern, and responsive websites and applications.",
    body: "Build fast, modern, and responsive websites and web applications with Next.js, React and TypeScript.",
    points: ["Custom Next.js websites", "React application development", "Landing pages", "Responsive UI development", "TypeScript implementation", "API integrations", "Vercel deployment"],
    tags: ["Next.js", "React", "TypeScript", "Vercel"],
    icon: "react",
  },
  {
    title: "Figma to Next.js + Sanity CMS",
    image: "/images/projects/restaurant-menu/studio.webp",
    imageAlt: "Content studio editing a menu item",
    short: "Convert your Figma designs into responsive websites with easy content editing.",
    body: "Convert your Figma designs into responsive websites with easy content editing in Sanity Studio.",
    points: ["Pixel-perfect Figma conversion", "Reusable React components", "Sanity Studio configuration", "Custom content schemas", "Editable pages and blogs", "Responsive implementation"],
    tags: ["Figma", "Next.js", "Sanity CMS", "Tailwind CSS"],
    icon: "pen",
  },
  {
    title: "WordPress to Next.js Migration",
    image: "/images/projects/blog-migration/cover.webp",
    imageAlt: "Blog migrated from WordPress to Next.js",
    short: "Modernize your WordPress website with a modern frontend and structured CMS.",
    body: "Modernize your existing WordPress website with a modern frontend and a structured CMS.",
    points: ["WordPress content migration", "Page and post migration", "Image migration", "Sanity CMS setup", "URL preservation and redirects", "SEO metadata migration", "Next.js frontend development"],
    tags: ["WordPress", "Next.js", "Sanity CMS", "SEO"],
    icon: "layers",
  },
  {
    title: "WordPress & Elementor Development",
    image: "/images/projects/business-wordpress/cover.webp",
    imageAlt: "Business website built with WordPress and Elementor",
    short: "Build professional business websites and landing pages.",
    body: "Build professional business websites and landing pages your team manages in WordPress.",
    points: ["Custom Elementor websites", "Figma and PSD to WordPress", "Responsive business websites", "Landing page development", "On-page SEO", "Speed and mobile optimization"],
    tags: ["WordPress", "Elementor", "PHP", "CSS"],
    icon: "browser",
  },
  {
    title: "Website Maintenance & Improvements",
    image: "/images/projects/creative-agency/cover.webp",
    imageAlt: "Agency website maintained with regular updates",
    short: "Keep your website updated and performing well.",
    body: "Keep your website updated and performing well with regular fixes, improvements and new features.",
    points: ["Bug fixing", "New feature development", "Content and layout updates", "Performance improvements", "Technical maintenance"],
    tags: ["Next.js", "WordPress", "Sanity CMS"],
    icon: "shield",
  },
];

/** Development approach shown on the services page */
export const approach = ["Understand requirements", "Plan", "AI-assisted development", "Human code review", "Testing", "Deployment"];

export const packages = [
  {
    name: "Quick start",
    title: "Landing Page",
    text: "One high-converting page in Next.js, React or WordPress, from your design.",
    points: ["Responsive, pixel-perfect build", "SEO and speed setup", "Contact form & analytics"],
    price: "Project estimate",
    featured: false,
  },
  {
    name: "Most popular",
    title: "Next.js + Sanity Website",
    text: "A multi-page website or WordPress migration your team edits in Sanity.",
    points: ["Custom pages & components", "Sanity Studio for your content", "SEO metadata & redirects"],
    price: "Project estimate",
    featured: true,
  },
  {
    name: "Ongoing",
    title: "Monthly Support",
    text: "A dedicated developer for updates, new features and ongoing improvements.",
    points: ["Reserved hours each month", "Priority response", "Bug fixes & improvements"],
    price: "Monthly retainer",
    featured: false,
  },
];

export const process = [
  { title: "Share your requirements", text: "Send your Figma design, current website, or application idea. I'll understand your goals and technical requirements." },
  { title: "Plan & estimate", text: "I'll suggest the right technologies, development approach, timeline, and project estimate." },
  { title: "Build & review", text: "I use modern development practices and AI-assisted workflows to build your project efficiently. You'll receive progress updates and preview links." },
  { title: "Test & launch", text: "I review the implementation, test responsive layouts, fix issues, and prepare your website for deployment." },
];

/* ------------------------------------------------------------------ */
/* About / experience                                                  */
/* ------------------------------------------------------------------ */

export const principles: { title: string; text: string; icon: IconName }[] = [
  { title: "AI-powered productivity", text: "AI tools help me move faster on planning, coding, debugging and migration work.", icon: "spark" },
  { title: "Clean code", text: "Reusable components, typed code and a structure that stays easy to extend.", icon: "code" },
  { title: "Practical problem-solving", text: "The right tool for the requirement — Next.js, Sanity or WordPress — not the trendiest one.", icon: "bolt" },
  { title: "Careful testing", text: "Every implementation is reviewed and tested across browsers and devices before delivery.", icon: "shield" },
];

/** "What I do" cards on the about page */
export const aboutFocus: { title: string; text: string; icon: IconName }[] = [
  { title: "AI-Powered Development", text: "I use AI tools to accelerate development, improve coding workflows, debug issues, and build modern digital solutions.", icon: "spark" },
  { title: "AI Integration", text: "I help integrate AI capabilities into web applications using suitable APIs and modern development technologies.", icon: "chat" },
  { title: "Next.js & React Development", text: "I build responsive websites, reusable components, and modern web applications.", icon: "code" },
  { title: "CMS & Website Solutions", text: "I develop editable websites using Sanity CMS and create or migrate WordPress websites.", icon: "layers" },
];

export const experience = {
  role: "Full Stack Developer",
  company: "Krushna53",
  place: "Ahmedabad, India",
  period: "June 2023 – Present",
  summary: "Building, migrating, and maintaining client websites using Next.js, React, Sanity CMS, and WordPress.",
  points: [
    "Build responsive Next.js websites from Figma and PSD designs.",
    "Develop reusable React components.",
    "Configure Sanity CMS schemas and Studio.",
    "Migrate WordPress websites to Next.js and Sanity.",
    "Maintain URLs, content, and SEO during migrations.",
    "Develop and customize WordPress websites.",
    "Fix bugs and improve existing client websites.",
    "Use Claude and Claude Code for AI-assisted development.",
    "Review, debug, and test implementations.",
  ],
  tags: ["Next.js", "React", "TypeScript", "Sanity CMS", "Tailwind CSS", "WordPress", "Elementor", "PHP", "Vercel", "Git", "Figma", "Claude Code"],
};

export const certifications = [
  { date: "February 2025", issuer: "Udemy", title: "Next.js", text: "App Router, data fetching, rendering strategies and deployment." },
  { date: "January 2025", issuer: "Udemy", title: "Full Stack Developer", text: "Frontend, backend and APIs — building complete web applications." },
  { date: "November 2024", issuer: "Udemy", title: "Frontend (React & Next.js)", text: "Modern React patterns, components and Next.js fundamentals." },
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
  { q: "What services do you offer?", a: "I specialize in AI-powered development, AI API integrations, Next.js and React websites, Figma-to-Next.js development, Sanity CMS, and WordPress migrations." },
  { q: "How do you use AI in development?", a: "I use Claude, Claude Code, ChatGPT, and related AI tools for planning, coding, component development, debugging, content migration, and testing. I review and validate the final implementation myself." },
  { q: "Can you integrate AI into my existing website?", a: "Yes. I can help integrate suitable AI APIs and intelligent features into existing Next.js applications and websites, depending on your requirements and available API capabilities." },
  { q: "Do you work with Claude Code?", a: "Yes. Claude Code is part of my development workflow for understanding codebases, building features, generating components, debugging, and improving code." },
  { q: "What is your experience with Next.js and Sanity?", a: "I have been working with Next.js, React, Sanity CMS, and WordPress in client website development since June 2023." },
  { q: "Can you migrate my WordPress website to Next.js?", a: "Yes. I can migrate pages, posts, images, and structured content to Sanity CMS, build a Next.js frontend, and configure redirects and SEO metadata." },
  { q: "How long does a project take?", a: "A landing page may take a few days, while a full website or migration may take 1–4 weeks, depending on scope, content, and requirements." },
  { q: "Do you work with international clients?", a: "Yes. I'm based in Ahmedabad, India, and available to work with clients and businesses worldwide." },
  { q: "What do you need to start?", a: "Share your Figma design, existing website URL, or project idea. I'll review it and provide a suitable plan, timeline, and estimate." },
];

export const projectTypes = [
  "AI Application Development", "AI Integration", "Claude Code / AI-Assisted Development", "Next.js / React Development",
  "Figma to Next.js", "WordPress Migration", "WordPress Development", "Other",
];

/** "What can I help you build?" list on the contact page */
export const helpWith = [
  "AI-powered web applications", "Claude API integrations", "AI assistants and intelligent features", "Next.js and React websites",
  "Figma to Next.js + Sanity CMS", "WordPress to Next.js migrations", "WordPress and Elementor websites",
];

export const budgets = [
  "Under $500", "$500 – $1,500", "$1,500 – $3,000", "$3,000+", "Prefer to discuss",
];
