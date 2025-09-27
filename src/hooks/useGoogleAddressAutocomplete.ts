"use client";
import { useEffect } from "react";
import type { MutableRefObject } from "react";
import type { ContactInfo } from "@/types/request-types";
import { getGoogleLoader } from "@/lib/request/loaderSingleton";

export function useGoogleAddressAutocomplete(
  step: number,
  contactInfo: ContactInfo,
  setContactInfo: (updater: (prev: ContactInfo) => ContactInfo) => void,
  addressInputRef: MutableRefObject<HTMLInputElement | null>
) {
  // keep a session token across focus of the input during this step
  const sessionTokenRef = {
    current: null as google.maps.places.AutocompleteSessionToken | null,
  };

  useEffect(() => {
    if (step !== 4) return;

    let listener: google.maps.MapsEventListener | null = null;
    let autocomplete: google.maps.places.Autocomplete | null = null;

    getGoogleLoader()
      .load()
      .then(() => {
        if (!addressInputRef.current) return;

        // fresh session when user focuses the field
        sessionTokenRef.current =
          new google.maps.places.AutocompleteSessionToken();

        autocomplete = new google.maps.places.Autocomplete(
          addressInputRef.current!,
          {
            componentRestrictions: { country: "ca" },
            fields: ["formatted_address"],
            types: ["address"],
          }
        );

        // @ts-expect-error sessionToken is valid at runtime
        autocomplete.setOptions({ sessionToken: sessionTokenRef.current });

        listener = autocomplete.addListener("place_changed", () => {
          const place = autocomplete!.getPlace();
          if (place.formatted_address) {
            setContactInfo((prev) => ({
              ...prev,
              address: place.formatted_address ?? "",
            }));
          }
          sessionTokenRef.current = null;
        });
      });

    return () => {
      if (listener) listener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
}
