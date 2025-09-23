"use client";
import { useEffect, useMemo, useRef } from "react";

export type AlbumCarouselProps = {
  albums: string[]; // list of normalized prefixes; include '' for All
  active: string;
  onChange: (prefix: string) => void;
};

export function AlbumCarousel({
  albums,
  active,
  onChange,
}: AlbumCarouselProps) {
  type AlbumDef = { label: string; prefix: string };
  const defs: AlbumDef[] = useMemo(() => {
    const map = (p: string): AlbumDef => ({
      label: p.replace(/\/$/, "") || "All",
      prefix: p,
    });
    // Ensure there is a single leading 'All'
    const unique = Array.from(new Set(albums));
    const withAllFirst = ["", ...unique.filter((p) => p !== "")];
    return withAllFirst.map(map);
  }, [albums]);

  const listRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const idx = defs.findIndex((d) => d.prefix === active);
    const el = chipRefs.current[idx];
    if (el)
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
  }, [active, defs]);

  return (
    <div className="mb-4">
      {/* Desktop buttons */}
      <div className="hidden md:flex flex-wrap items-center gap-2">
        {defs.map(({ label, prefix }) => (
          <button
            key={prefix || "root"}
            onClick={() => onChange(prefix)}
            className={`px-3 py-1.5 rounded-full border text-sm transition ${
              active === prefix
                ? "bg-primary text-light border-primary"
                : "bg-background text-heading border-gray hover:bg-accent/30"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mobile: horizontally scrollable chips */}
      <div
        ref={listRef}
        className="md:hidden -mx-4 px-4 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Album selector"
        role="tablist"
      >
        <div className="flex items-center gap-2 snap-x snap-mandatory">
          {defs.map(({ label, prefix }, i) => (
            <button
              ref={(el) => {
                chipRefs.current[i] = el;
              }}
              key={prefix || "root"}
              role="tab"
              aria-selected={active === prefix}
              onClick={() => onChange(prefix)}
              className={`snap-start px-3 py-2 rounded-full border text-sm shrink-0 transition ${
                active === prefix
                  ? "bg-primary text-light border-primary"
                  : "bg-background text-heading border-gray hover:bg-accent/30"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
