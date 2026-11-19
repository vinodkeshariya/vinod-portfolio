import Image from "next/image";

type Img = { src: string; alt: string };

function Browser({ img, className, sizes, priority }: { img: Img; className: string; sizes: string; priority?: boolean }) {
  return (
    <div className={`absolute overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_24px_60px_-24px_rgb(36_40_36/0.4)] ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-black/5 px-3 py-2">
        <i className="size-2 rounded-full bg-[#ff5f57]" />
        <i className="size-2 rounded-full bg-[#febc2e]" />
        <i className="size-2 rounded-full bg-[#28c840]" />
      </div>
      <div className="relative aspect-16/10">
        <Image src={img.src} alt={img.alt} fill sizes={sizes} priority={priority} className="object-cover object-left-top" />
      </div>
    </div>
  );
}

/**
 * Layered collage of real project screens: two browser windows and a phone.
 * Used as the visual on inner page heroes.
 */
export function ImageStack({ back, front, phone, priority = false }: { back: Img; front: Img; phone: Img; priority?: boolean }) {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px] lg:mr-0">
      <Browser img={back} className="left-0 top-0 w-[72%] -rotate-2" sizes="400px" priority={priority} />
      <Browser img={front} className="bottom-[6%] right-0 w-[74%] rotate-1" sizes="420px" priority={priority} />
      <div className="absolute bottom-0 left-[8%] w-[20%] overflow-hidden rounded-[16px] border-[5px] border-ink bg-ink shadow-[0_24px_50px_-16px_rgb(36_40_36/0.5)]">
        <div className="relative aspect-[390/844]">
          <Image src={phone.src} alt={phone.alt} fill sizes="120px" className="object-cover object-top" />
        </div>
      </div>
    </div>
  );
}
