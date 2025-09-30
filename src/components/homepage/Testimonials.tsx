"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";

export type Testimonial = {
  quote: string;
  name: string;
};

export type TestimonialsProps = {
  title?: string;
  items: Testimonial[];
  autoplayMs?: number; // e.g. 4500
  className?: string;
};

export default function Testimonials({
  title = "What clients say",
  items,
  autoplayMs = 4500,
  className = "",
}: TestimonialsProps) {
  // Embla only for mobile; desktop renders a simple grid
  const plugin = React.useRef(
    Autoplay({ delay: autoplayMs, stopOnInteraction: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false, dragFree: false },
    [plugin.current]
  );

  const [selected, setSelected] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();

    emblaApi.on("select", onSelect).on("reInit", () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    });

    // Pause on hover/focus for accessibility
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
      emblaApi.destroy();
    };
  }, [emblaApi]);

  const scrollTo = (i: number) => emblaApi?.scrollTo(i);
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (!items?.length) return null;

  return (
    <section
      aria-labelledby="testimonials-title"
      className={`relative w-full bg-white text-black ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h2
            id="testimonials-title"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">Real words from recent clients.</p>
        </header>

        {/* Mobile: Embla carousel */}
        <div className="relative md:hidden">
          <div
            className="overflow-hidden"
            ref={emblaRef}
            aria-roledescription="carousel"
          >
            <div className="flex -ml-4">
              {items.map((t, i) => (
                <Slide key={i} index={i} total={items.length}>
                  <Card quote={t.quote} name={t.name} />
                </Slide>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm hover:bg-zinc-50 active:scale-[0.98]"
            >
              ←
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm hover:bg-zinc-50 active:scale-[0.98]"
            >
              →
            </button>
          </div>

          {/* Dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 w-6 rounded-full transition-all ${
                  selected === i ? "bg-zinc-900 w-8" : "bg-zinc-300 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: clean grid (no carousel for better layout) */}
        <div className="mx-auto hidden grid-cols-2 gap-6 md:grid lg:grid-cols-3">
          {items.map((t, i) => (
            <Card key={i} quote={t.quote} name={t.name} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Slide({
  children,
  index,
  total,
}: React.PropsWithChildren<{ index: number; total: number }>) {
  return (
    <div
      className="min-w-0 shrink-0 grow-0 basis-full pl-4 sm:basis-3/4"
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${index + 1} of ${total}`}
    >
      {children}
    </div>
  );
}

function Card({ quote, name }: Testimonial) {
  return (
    <article className="group relative">
      <div className="relative rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
        {/* Decorative quote mark */}
        <Quote className="absolute right-6 top-6 h-8 w-8 text-zinc-300" aria-hidden="true" />

        {/* Content */}
        <blockquote className="pr-6 font-serif text-pretty text-xl leading-relaxed text-zinc-900">
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
