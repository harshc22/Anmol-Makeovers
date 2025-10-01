"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Instagram, MessageSquare, X } from "lucide-react";

export type ContactPromptProps = {
  email: string;
  igHandle?: string;
  label?: string;
  className?: string;
};

export default function ContactPrompt({
  email,
  igHandle,
  label = "Questions?",
  className = "",
}: ContactPromptProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const mailURL = `mailto:${email}`;
  const igURL = igHandle ? `https://instagram.com/${igHandle}` : undefined;

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className={`relative mt-4 px-4 flex justify-end ${className}`} aria-live="polite">
      <div className="relative">
        <motion.button
          ref={btnRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MessageSquare className="h-4 w-4" aria-hidden />
          <span>{label}</span>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-label="Contact options"
              initial={{ opacity: 0, y: 8, scale: 0.98, transformOrigin: "bottom right" }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="absolute bottom-full right-0 mb-2 w-[min(92vw,20rem)] rounded-2xl border border-neutral-200 bg-white/95 p-3 shadow-2xl backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3 p-2">
                <div>
                  <p className="text-sm font-semibold">Unsure about something?</p>
                  <p className="text-xs text-neutral-600">DM on Instagram or email me, I will reply promptly.</p>
                </div>
                <button
                  aria-label="Close contact panel"
                  className="rounded-full p-1.5 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-1 grid grid-cols-1 gap-2 p-2">
                <a
                  href={mailURL}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2 transition hover:border-indigo-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4" aria-hidden />
                    <div className="text-left">
                      <p className="text-sm font-medium leading-tight">Email me</p>
                      <p className="text-xs text-neutral-600 leading-tight">{email}</p>
                    </div>
                  </div>
                </a>

                {igURL && (
                  <a
                    href={igURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2 transition hover:border-indigo-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <div className="flex items-center gap-3">
                      <Instagram className="h-4 w-4" aria-hidden />
                      <div className="text-left">
                        <p className="text-sm font-medium leading-tight">Instagram</p>
                        <p className="text-xs text-neutral-600 leading-tight">@{igHandle}</p>
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}