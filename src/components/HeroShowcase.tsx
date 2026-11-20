import Image from "next/image";

const shots = [
  {
    src: "/images/projects/fashion-catalog/cover.webp",
    alt: "Fashion e-commerce store homepage",
    className: "right-[2%] top-0 w-[62%] rotate-[6deg] animate-float-slow",
  },
  {
    src: "/images/projects/creative-agency/cover.webp",
    alt: "Creative agency website homepage",
    className: "left-0 top-[30%] z-10 w-[56%] rotate-[8deg] animate-float",
  },
  {
    src: "/images/projects/ai-saas-landing/cover.webp",
    alt: "AI SaaS landing page with analytics dashboard",
    className: "bottom-[2%] right-0 z-20 w-[52%] -rotate-[4deg] animate-float-slow",
  },
];

/** Three tilted project screenshots over a soft lime glow (home hero) */
export function HeroShowcase() {
  return (
    <div style={{ animationDelay: "200ms" }} className="animate-fade-in relative mx-auto aspect-[1.18/1] w-full max-w-[600px] lg:mr-0">
      <span
        aria-hidden="true"
        className="absolute -right-[18%] -top-[22%] size-[120%] rounded-full bg-[radial-gradient(closest-side,rgb(214_230_166/0.75),rgb(214_230_166/0.25)_60%,transparent)]"
      />
      {shots.map((s, i) => (
        <figure
          key={s.src}
          className={`absolute overflow-hidden rounded-[12px] border-[5px] border-white bg-white shadow-[0_2px_4px_rgb(36_40_36/0.06),0_30px_60px_-24px_rgb(36_40_36/0.35)] transition-[scale,box-shadow] duration-500 ease-out hover:z-30 hover:scale-[1.05] hover:shadow-[0_2px_4px_rgb(36_40_36/0.08),0_40px_70px_-24px_rgb(36_40_36/0.45)] ${s.className}`}
        >
          <Image
            src={s.src}
            alt={s.alt}
            width={1440}
            height={900}
            priority={i === 0}
            sizes="(min-width: 1024px) 340px, 60vw"
            className="block aspect-[16/10] w-full rounded-[7px] object-cover object-top"
          />
        </figure>
      ))}
    </div>
  );
}
