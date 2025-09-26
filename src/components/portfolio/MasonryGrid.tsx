"use client";

export interface GridItem {
  name: string;
  path: string;
  updated_at?: string;
}

export function MasonryGrid({
  items,
  onSelectIndex,
  toUrl,
}: {
  items: GridItem[];
  onSelectIndex: (idx: number) => void;
  toUrl: (path: string) => string;
}) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
      {items.map((it, idx) => (
        <figure
          key={it.path}
          className="mb-4 break-inside-avoid rounded-xl overflow-hidden shadow ring-1 ring-black/5"
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
    </div>
  );
}
