"use client";
import { useEffect, useState } from "react";

export function Lightbox({ urls }: { urls: string[] }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const close = () => setOpen(false);
  const prev = () => setCurrent((i) => (i - 1 + urls.length) % urls.length);
  const next = () => setCurrent((i) => (i + 1) % urls.length);

  // Open from anywhere via a custom event
  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent<number>).detail ?? 0;
      setCurrent(idx);
      setOpen(true);
    };
    window.addEventListener("open-lightbox", handler as EventListener);
    return () =>
      window.removeEventListener("open-lightbox", handler as EventListener);
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={close}
    >
      <div
        className="relative max-w-6xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={urls[current]}
          alt="Full view"
          className="w-full h-auto max-h-[90vh] object-contain rounded-xl shadow-2xl"
          loading="eager"
          decoding="async"
        />
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-primary text-light hover:opacity-90 shadow"
        >
          ✕
        </button>
        {urls.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute top-1/2 -translate-y-1/2 left-2 px-3 py-2 rounded-full bg-primary text-light hover:opacity-90 shadow"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute top-1/2 -translate-y-1/2 right-2 px-3 py-2 rounded-full bg-primary text-light hover:opacity-90 shadow"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
