"use client";

import { useEffect, useState } from "react";
import YARL from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

export function Lightbox({ urls }: { urls: string[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent<number>).detail ?? 0;
      setIndex(idx);
      setOpen(true);
    };
    window.addEventListener("open-lightbox", handler as EventListener);
    return () => window.removeEventListener("open-lightbox", handler as EventListener);
  }, []);

  return (
    <YARL
      open={open}
      close={() => setOpen(false)}
      index={index}
      slides={urls.map((src) => ({ src }))}
      plugins={[Zoom]}
    />
  );
}
