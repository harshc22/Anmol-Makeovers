"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";

type Card = {
  title: string;
  blurb: string;
  img: string;
  alt: string;
};

const cards: Card[] = [
  {
    title: "Bridal",
    blurb: "Timeless, photo-ready looks that last the whole day",
    img: "/images/services/bridal.jpg",
    alt: "Bridal makeup close-up",
  },
  {
    title: "Non-Bridal / Party",
    blurb: "Soft to full glam for receptions and special events",
    img: "/images/services/party.jpg",
    alt: "Party glam makeup",
  },
  {
    title: "Editorial",
    blurb: "Mood-board driven looks for shoots and campaigns",
    img: "/images/services/editorial.jpg",
    alt: "Editorial makeup on set",
  },
];

export default function ServicesShowcase() {
  return (
    <section className="bg-background border-t border-gray-100 mt-20 pt-10 pb-10">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-4xl font-serif text-center leading-tight text-dark sm:text-5xl">
          SERVICES
        </h2>

        {/* CSS-only reveal + light stagger via inline delay */}
        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <EqualTile key={card.title} index={i} {...card} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/request"
            className="mx-auto flex w-full max-w-[400px] items-center justify-center rounded-full border-2 border-primary px-3 py-4 font-semibold tracking-wide transition hover:bg-accent"
          >
            GET IN TOUCH
          </a>
        </div>
      </div>
    </section>
  );
}

function EqualTile({
  title,
  blurb,
  img,
  alt,
  index,
}: Card & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  return (
    <article
      ref={ref}
      className={[
        "group h-full overflow-hidden rounded-2xl border border-gray bg-white shadow-sm",
        "transform-gpu [backface-visibility:hidden] [transform-style:preserve-3d] [contain:paint]",
        "transition-transform transition-opacity duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Stable backdrop prevents blank → image flash on mobile */}
      <div className="relative aspect-[4/5] w-full bg-neutral-100">
        <Image
          src={img}
          alt={alt}
          fill
          // First image eager; rest lazy = smoother first paint, less decode thrash
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 md:group-hover:scale-[1.03] transform-gpu"
        />

        {/* Non-animated overlay to avoid opacity flashes */}
        <div className="absolute inset-0 flex items-end">
          <div className="relative w-full p-6">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="relative">
              <h3 className="text-white text-xl font-bold tracking-tight text-balance drop-shadow-md">
                {title}
              </h3>
              <p className="mt-2 max-w-[40ch] text-md leading-relaxed text-white/90">
                {blurb}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
