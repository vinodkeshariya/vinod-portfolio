import Image from "next/image";

/** Position and tilt of the 1st, 2nd and 3rd screenshot */
const places = [
  "right-[2%] top-0 w-[62%] rotate-[6deg] animate-float-slow",
  "left-0 top-[30%] z-10 w-[56%] rotate-[8deg] animate-float",
  "bottom-[2%] right-0 z-20 w-[52%] -rotate-[4deg] animate-float-slow",
];

/** Three tilted project screenshots over a soft lime glow (home + hire-me hero). The images come from the CMS (Home page → Page texts). */
export function HeroShowcase({ shots }: { shots: { src: string; alt: string }[] }) {
  return (
    <div style={{ animationDelay: "200ms" }} className="animate-fade-in relative mx-auto aspect-[1.18/1] w-full max-w-[600px] lg:mr-0">
      <span
        aria-hidden="true"
        className="absolute -right-[18%] -top-[22%] size-[120%] rounded-full bg-[radial-gradient(closest-side,rgb(214_230_166/0.75),rgb(214_230_166/0.25)_60%,transparent)]"
      />
      {shots.slice(0, 3).map((s, i) => (
        <figure
          key={s.src}
          className={`absolute overflow-hidden rounded-[12px] border-[5px] border-white bg-white shadow-[0_2px_4px_rgb(36_40_36/0.06),0_30px_60px_-24px_rgb(36_40_36/0.35)] transition-[scale,box-shadow] duration-500 ease-out hover:z-30 hover:scale-[1.05] hover:shadow-[0_2px_4px_rgb(36_40_36/0.08),0_40px_70px_-24px_rgb(36_40_36/0.45)] ${places[i]}`}
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
