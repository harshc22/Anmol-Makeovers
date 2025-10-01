"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";

export type Testimonial = {
  quote: string;
  name: string;
};

export type SlidesPerView = {
  sm?: number;
  md?: number;
  lg?: number;
};

export type TestimonialsProps = {
  title?: string;
  items: Testimonial[];
  autoplayMs?: number;
  className?: string;
  slidesPerView?: SlidesPerView;
  minQuoteHeight?: string;
};

export default function Testimonials({
  title = "What clients say",
  items,
  autoplayMs = 4500,
  className = "",
  slidesPerView = { sm: 1, md: 2, lg: 3 },
  minQuoteHeight = "min-h-[7rem]",
}: TestimonialsProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const plugin = React.useRef(
    prefersReducedMotion
      ? undefined
      : Autoplay({ delay: autoplayMs, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      containScroll: "trimSnaps",
    },
    plugin.current ? [plugin.current] : []
  );

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    setSelectedIndex(emblaApi.selectedScrollSnap());

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (!items?.length) return null;

  const basisSm = `basis-${toFraction(slidesPerView.sm ?? 1)}`;
  const basisMd = slidesPerView.md
    ? `md:basis-${toFraction(slidesPerView.md)}`
    : "";
  const basisLg = slidesPerView.lg
    ? `lg:basis-${toFraction(slidesPerView.lg)}`
    : "";

  return (
    <section
      aria-labelledby="testimonials-title"
      className={`relative w-full bg-white text-black border-t border-gray ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h2
            id="testimonials-title"
            className="text-4xl font-serif text-center leading-tight text-dark sm:text-5xl"
          >
            {title}
          </h2>
          <p className="mt-2 text-md text-gray-700">
            What my clients are saying
          </p>
        </header>

        <div className="relative">
          <div
            className="overflow-hidden grow py-4 px-3"
            ref={emblaRef}
            aria-roledescription="carousel"
            aria-label="Testimonials carousel"
          >
            <div className="flex -ml-4 items-stretch">
              {items.map((t, i) => (
                <div
                  key={i}
                  className={`min-w-0 shrink-0 grow-0 pl-4 ${basisSm} ${basisMd} ${basisLg}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Slide ${i + 1} of ${items.length}`}
                >
                  <Card
                    quote={t.quote}
                    name={t.name}
                    minQuoteHeight={minQuoteHeight}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots under the track */}
        {/* Dots under the track (decorative look, clickable) */}
        <div className="mt-6 flex items-center justify-center gap-0.5">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                emblaApi?.scrollTo(index);
                plugin.current?.play(); // resume autoplay after navigation
              }}
              aria-label={`Go to slide ${index + 1}`}
              className="p-2"
            >
              <span
                className={`block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-colors ${
                  index === selectedIndex
                    ? "bg-primary"
                    : "bg-zinc-300 hover:bg-zinc-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  quote,
  name,
  minQuoteHeight,
}: Testimonial & { minQuoteHeight: string }) {
  return (
    <article className="group relative h-full">
      <div className="relative flex h-full flex-col rounded-3xl border-3 border-gray-100 p-6 shadow-sm transition-transform duration-200 hover:shadow-md hover:scale-[1.02]">
        <Quote
          className="absolute right-4 top-6 h-9 w-9 text-pink hover:scale-110 transition"
          aria-hidden="true"
        />
        <blockquote
          className={`pr-8 text-pretty text-l leading-relaxed text-zinc-900 flex-1 ${minQuoteHeight}`}
        >
          {quote}
        </blockquote>
        <footer className="mt-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-zinc-700">
            <div className="h-1.5 w-6 rounded-full bg-primary" />
            <span aria-label="Author">{name}</span>
          </div>
        </footer>
      </div>
    </article>
  );
}

function toFraction(n: number): string {
  switch (n) {
    case 1:
      return "full";
    case 2:
      return "1/2";
    case 3:
      return "1/3";
    case 4:
      return "1/4";
    case 5:
      return "[20%]";
    case 6:
      return "1/6";
    default:
      return "full";
  }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}
