"use client";

import Masonry from "react-masonry-css";

export interface GridItem {
  name: string;
  path: string;
  updated_at?: string;
}

interface MasonryGridProps {
  items: GridItem[];
  onSelectIndex: (idx: number) => void;
  toUrl: (path: string) => string;
}

export function MasonryGrid({ items, onSelectIndex, toUrl }: MasonryGridProps) {
  // Breakpoints for responsiveness
  const breakpointColumns = {
    default: 3, // 3 columns on large screens
    1024: 2,    // 2 columns on tablets
    640: 1,     // 1 column on small screens
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex gap-4" // container
      columnClassName="flex flex-col gap-4" // each column
    >
      {items.map((it, idx) => (
        <figure
          key={it.path}
          className="rounded-xl overflow-hidden shadow ring-1 ring-black/5"
        >
          <img
            src={toUrl(it.path)}
            alt={it.name}
            loading="lazy"
            decoding="async"
            className="w-full h-auto cursor-zoom-in block"
            onClick={() => onSelectIndex(idx)}
          />
        </figure>
      ))}
    </Masonry>
  );
}
