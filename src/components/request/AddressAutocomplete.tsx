"use client";

import { useEffect, useRef } from "react";
import { getMapsLoader } from "@/lib/request/loaderSingleton";

type Props = {
  inputId: string;
  placeholder?: string;
  defaultValue?: string;
  country?: string; // e.g. "ca"
  onSelect: (v: { address: string; placeId: string }) => void;
  minChars?: number;
  debounceMs?: number;
};

export default function AddressAutocomplete({
  inputId,
  placeholder = "Start typing an address for autofill",
  defaultValue,
  country = "ca",
  onSelect,
  minChars = 5,
  debounceMs = 250,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const placeChangedListenerRef = useRef<google.maps.MapsEventListener | null>(
    null
  );
  const inputListenerRef = useRef<EventListener | null>(null);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    let cancelled = false;
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    getMapsLoader()
      .load()
      .then(() => {
        if (cancelled) return;
        const el = inputRef.current;
        if (!el) return;

        const maybeInitAutocomplete = () => {
          if (acRef.current || !inputRef.current) return;
          const val = inputRef.current.value.trim();
          if (val.length < minChars) return;

          sessionTokenRef.current =
            new google.maps.places.AutocompleteSessionToken();

          acRef.current = new google.maps.places.Autocomplete(
            inputRef.current,
            {
              fields: ["place_id", "formatted_address"],
              types: ["address"],
              componentRestrictions: { country },
            }
          );

          // @ts-expect-error - setOptions supports { sessionToken } at runtime
          acRef.current.setOptions({ sessionToken: sessionTokenRef.current });

          placeChangedListenerRef.current = acRef.current.addListener(
            "place_changed",
            () => {
              const place = acRef.current!.getPlace();
              const placeId = place.place_id ?? "";
              const address =
                place.formatted_address || inputRef.current!.value || "";
              if (placeId && address) onSelect({ address, placeId });
              sessionTokenRef.current = null;
            }
          );
        };

        const onInput: EventListener = () => {
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(maybeInitAutocomplete, debounceMs);
        };

        if (el.value.trim().length >= minChars) maybeInitAutocomplete();

        el.addEventListener("input", onInput);
        inputListenerRef.current = onInput;
      });

    return () => {
      cancelled = true;
      if (inputRef.current && inputListenerRef.current) {
        inputRef.current.removeEventListener("input", inputListenerRef.current);
      }
      if (debounceTimer) clearTimeout(debounceTimer);
      placeChangedListenerRef.current?.remove();
      acRef.current = null;
    };
  }, [country, onSelect, minChars, debounceMs]);

  return (
    <input
      id={inputId}
      ref={inputRef}
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full text-dark transition-colors"
      // Helps avoid browser’s own address autofill from fighting the widget
      autoComplete="off"
      // optional: name="street-address"
    />
  );
}
