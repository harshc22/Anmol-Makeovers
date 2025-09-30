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
  sm?: number; // >=0px
  md?: number; // >=768px
  lg?: number; // >=1024px
};

export type TestimonialsProps = {
  title?: string;
  items: Testimonial[];
  autoplayMs?: number; // e.g. 4500
  className?: string;
  slidesPerView?: SlidesPerView; // how many cards per breakpoint
  minQuoteHeight?: string; // Tailwind value e.g. "min-h-[7rem]"
  showArrows?: boolean; // desktop arrows
};

export default function Testimonials({
  title = "What clients say",
  items,
  autoplayMs = 4500,
  className = "",
  slidesPerView = { sm: 1, md: 2, lg: 3 },
  minQuoteHeight = "min-h-[7rem]",
  showArrows = true,
}: TestimonialsProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Embla on all breakpoints; dots removed by design
  const plugin = React.useRef(
    prefersReducedMotion ? undefined : Autoplay({ delay: autoplayMs, stopOnInteraction: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: false,
      containScroll: "trimSnaps",
    },
    plugin.current ? [plugin.current] : []
  );

  // Pause on hover/focus for accessibility
  React.useEffect(() => {
    if (!emblaApi || !plugin.current) return;
    const root = emblaApi.rootNode();
    const stop = () => plugin.current?.stop();
    const play = () => plugin.current?.play();
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", play);
    return () => {
      root.removeEventListener("mouseenter", stop);
      root.removeEventListener("mouseleave", play);
      root.removeEventListener("focusin", stop);
      root.removeEventListener("focusout", play);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (!items?.length) return null;

  // Build responsive basis classes from slidesPerView
  const basisSm = `basis-${toFraction(slidesPerView.sm ?? 1)}`;
  const basisMd = slidesPerView.md ? `md:basis-${toFraction(slidesPerView.md)}` : "";
  const basisLg = slidesPerView.lg ? `lg:basis-${toFraction(slidesPerView.lg)}` : "";

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
          <p className="mt-2 text-sm text-zinc-600">Real words from recent clients</p>
        </header>

        <div className="relative" onKeyDown={(e) => handleArrowKeys(e, scrollPrev, scrollNext)}>
          <div
            className="overflow-hidden py-4 px-3"
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
                  <Card quote={t.quote} name={t.name} minQuoteHeight={minQuoteHeight} />
                </div>
              ))}
            </div>
          </div>

          {showArrows && (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden md:flex items-center justify-between">
              <ArrowButton dir="prev" onClick={scrollPrev} label="Previous testimonial" />
              <ArrowButton dir="next" onClick={scrollNext} label="Next testimonial" />
            </div>
          )}

          {/* Mobile controls under track */}
          <div className="mt-6 flex items-center justify-center gap-4 md:hidden">
            <ArrowButton dir="prev" onClick={scrollPrev} label="Previous testimonial" />
            <ArrowButton dir="next" onClick={scrollNext} label="Next testimonial" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowButton({ dir, onClick, label }: { dir: "prev" | "next"; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`pointer-events-auto rounded-xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm text-zinc-800 shadow-sm hover:bg-white active:scale-[0.98] ${
        dir === "prev" ? "ml-1" : "mr-1"
      }`}
    >
      {dir === "prev" ? "←" : "→"}
    </button>
  );
}

function Card({ quote, name, minQuoteHeight }: Testimonial & { minQuoteHeight: string }) {
  return (
    <article className="group relative h-full">
      <div className="relative flex h-full flex-col rounded-3xl border-2 border-primary bg-gradient-to-t from-[#ffc2d1] to-white to-75% p-6 shadow-sm transition-transform duration-200 hover:shadow-md hover:scale-[1.02]">
        <Quote className="absolute right-4 top-6 h-9 w-9 text-pink hover:scale-[1.2]" aria-hidden="true" />
        <blockquote className={`pr-8 font-serif text-pretty text-xl leading-relaxed text-zinc-900 flex-1 ${minQuoteHeight}`}>
          {quote}
        </blockquote>
        <footer className="mt-8 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-zinc-700">
            <div className="h-1.5 w-6 rounded-full bg-zinc-900" />
            <span aria-label="Author">{name}</span>
          </div>
        </footer>
      </div>
    </article>
  );
}

function handleArrowKeys(
  e: React.KeyboardEvent<HTMLDivElement>,
  prev: () => void,
  next: () => void
) {
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
}

function toFraction(n: number): string {
  // map 1..6 to Tailwind fractions (1=full, 2=1/2, 3=1/3, 4=1/4, 5=\[20%], 6=1/6)
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
      return "[20%]"; // requires arbitrary values enabled (Tailwind default)
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
