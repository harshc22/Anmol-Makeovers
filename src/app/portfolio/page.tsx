"use client";

import { useMemo, useState } from "react";
import { AlbumCarousel } from "@/components/AlbumCarousel";
import { Lightbox } from "@/components/Lightbox";
import { MasonryGrid } from "@/components/MasonryGrid";
import { usePortfolio } from "@/hooks/usePortfolio";
import { DEFAULT_PREFIX, ALBUM_PREFIXES } from "@/lib/portfolio/config";
import { publicUrl } from "@/lib/portfolio/storage";

export default function PortfolioPage() {
  const [album, setAlbum] = useState<string>(DEFAULT_PREFIX);
  const { items, loading, error, bucket, baseUrl } = usePortfolio(album);

  const urls = useMemo(
    () => items.map((it) => publicUrl(baseUrl, bucket, it.path)),
    [items, baseUrl, bucket]
  );

  return (
    <main className="mx-auto max-w-7xl p-6 mt-20">
      <div className="relative flex items-center justify-between gap-4 mb-3">
        <h1 className="text-3xl hidden sm:block font-serif">PORTFOLIO</h1>
        <div className="hidden md:block" />
      </div>

      <AlbumCarousel
        albums={["", ...ALBUM_PREFIXES]}
        active={album}
        onChange={setAlbum}
      />

      {loading && <div className="p-4 text-gray-500">Loading images…</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}

      <MasonryGrid
        items={items}
        onSelectIndex={(idx) => {
          window.dispatchEvent(
            new CustomEvent("open-lightbox", { detail: idx })
          );
        }}
        toUrl={(path) => publicUrl(baseUrl, bucket, path)}
      />

      <Lightbox urls={urls} />
    </main>
  );
}
