"use client";

import {motion} from "framer-motion"
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
    <section className="bg-background border-t border-gray mt-20 pt-10 pb-10">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-4xl font-serif text-center leading-tight text-dark sm:text-5xl">
          SERVICES
        </h2>

        {/* Uniform grid, equal tiles */}
        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <EqualTile key={card.title} {...card} />
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

function EqualTile({ title, blurb, img, alt }: Card) {
  return (
    <motion.article
      className="group h-full overflow-hidden rounded-2xl border border-gray bg-white shadow-sm transition hover:shadow-md"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Lock the height with aspect ratio */}
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={img}
          alt={alt}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* stronger gradient behind text */}
        <div className="absolute inset-0 flex items-end">
          <div className="relative w-full p-6">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

            {/* text always sits on top of the gradient */}
            <div className="relative">
              <h3 className="text-xl font-serif text-white drop-shadow-md">
                {title}
              </h3>
              <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-white/90">
                {blurb}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
