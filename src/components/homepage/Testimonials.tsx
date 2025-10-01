"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";
import clsx from "clsx";

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

  // Literal classes (Tailwind can see these at build time)
  const slideClass = clsx(
    "min-w-0 shrink-0 grow-0 pl-4",
    // base
    (slidesPerView.sm ?? 1) === 1 && "basis-full",
    (slidesPerView.sm ?? 1) === 2 && "basis-1/2",
    (slidesPerView.sm ?? 1) === 3 && "basis-1/3",
    (slidesPerView.sm ?? 1) === 4 && "basis-1/4",
    (slidesPerView.sm ?? 1) === 5 && "basis-[20%]",
    (slidesPerView.sm ?? 1) === 6 && "basis-1/6",
    // md
    slidesPerView.md === 1 && "md:basis-full",
    slidesPerView.md === 2 && "md:basis-1/2",
    slidesPerView.md === 3 && "md:basis-1/3",
    slidesPerView.md === 4 && "md:basis-1/4",
    slidesPerView.md === 5 && "md:basis-[20%]",
    slidesPerView.md === 6 && "md:basis-1/6",
    // lg
    slidesPerView.lg === 1 && "lg:basis-full",
    slidesPerView.lg === 2 && "lg:basis-1/2",
    slidesPerView.lg === 3 && "lg:basis-1/3",
    slidesPerView.lg === 4 && "lg:basis-1/4",
    slidesPerView.lg === 5 && "lg:basis-[20%]",
    slidesPerView.lg === 6 && "lg:basis-1/6"
  );

  return (
    <section
      aria-labelledby="testimonials-title"
      className={clsx(
        "relative w-full bg-white text-black border-t border-gray-100",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h2
            id="testimonials-title"
            className="text-4xl font-serif text-center leading-tight text-zinc-900 sm:text-5xl"
          >
            {title}
          </h2>
          <p className="mt-2 text-base text-gray-700">
            What my clients are saying
          </p>
        </header>

        <div className="relative">
          {/* Viewport */}
          <div
            className="overflow-hidden grow py-4 px-3"
            ref={emblaRef}
            aria-roledescription="carousel"
            aria-label="Testimonials carousel"
          >
            {/* Track */}
            <div className="flex -ml-4 items-stretch">
              {items.map((t, i) => (
                <div
                  key={i}
                  className={slideClass}
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

        {/* Dots (decorative look, clickable) */}
        <div className="mt-6 flex items-center justify-center gap-0.5">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                emblaApi?.scrollTo(index);
                plugin.current?.play(); // keep autoplay alive
              }}
              aria-label={`Go to slide ${index + 1}`}
              className="p-2"
            >
              <span
                className={clsx(
                  "block rounded-full transition-colors h-1.5 w-1.5 sm:h-2 sm:w-2",
                  index === selectedIndex
                    ? "bg-primary"
                    : "bg-zinc-300 hover:bg-zinc-400"
                )}
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
        <blockquote className={clsx("pr-8 text-pretty text-base leading-relaxed text-zinc-900 flex-1", minQuoteHeight)}>
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
