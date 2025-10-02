"use client";
import React, { memo } from "react";
import type { EventData } from "@/types/request-types";
import { NonServiceField } from "@/types/request-types";
import AddressAutocomplete from "@/components/request/AddressAutocomplete";

interface Props {
  index: number;
  event: EventData;
  today: string;
  onChange: (index: number, field: NonServiceField, value: string) => void;
  onToggleService: (index: number, service: string) => void;
}

function EventCard({ index, event, today, onChange, onToggleService }: Props) {
  const services = ["Makeup", "Hair"] as const;

  const handleLocationType = (type: "studio" | "onsite") => {
    onChange(index, "locationType", type);
    // prevent stale addresses lingering when user flips back to studio
    if (type === "studio" && event.locationAddress) {
      onChange(index, "locationAddress", "");
    }
  };

  return (
    <div className="border border-gray rounded-xl p-6 space-y-4">
      <h3 className="text-xl font-semibold text-heading">Event {index + 1}</h3>

      <input
        type="text"
        placeholder="Event Type (e.g. Party)"
        className="w-full text-dark transition-colors"
        value={event.eventType}
        onChange={(e) => onChange(index, "eventType", e.target.value)}
      />

      <label className="block text-sm font-medium text-heading mb-2">
        Event Date
      </label>
      <input
        type="date"
        min={today}
        className="w-full text-dark transition-colors"
        value={event.date}
        onChange={(e) => onChange(index, "date", e.target.value)}
      />

      <label className="block text-sm font-medium text-heading mb-2">
        Ready Time
      </label>
      <input
        type="time"
        className="w-full text-dark transition-colors"
        value={event.time}
        onChange={(e) => onChange(index, "time", e.target.value)}
      />

      <label className="block text-sm font-medium text-heading mb-2">
        Number of People
      </label>
      <select
        value={event.people}
        onChange={(e) => onChange(index, "people", e.target.value)}
        className="w-full text-dark transition-colors"
      >
        <option value="" disabled>
          Select number of people
        </option>
        {Array.from({ length: 10 }, (_, i) => (
          <option key={i + 1} value={String(i + 1)}>
            {i + 1}
          </option>
        ))}
      </select>

      <div>
        <label className="block text-sm font-medium text-heading mb-2">
          Services{" "}
          <span className="text-sm text-gray-500">(you can choose both)</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => {
            const selected = event.services.includes(service);
            const id = `svc-${index}-${service.toLowerCase()}`;
            return (
              <label
                key={service}
                htmlFor={id}
                className={`flex items-center justify-center rounded-full border text-lg font-medium py-3 cursor-pointer transition-all duration-200 ${
                  selected
                    ? "bg-accent text-dark border-primary shadow-md"
                    : "bg-background text-dark border-gray hover:bg-accent/70"
                }`}
              >
                <input
                  id={id}
                  type="checkbox"
                  className="hidden"
                  checked={selected}
                  onChange={() => onToggleService(index, service)}
                />
                {service}
              </label>
            );
          })}
        </div>
      </div>

      {/* Ready Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-heading">
          Ready Location
        </label>

        <div className="grid grid-cols-2 gap-3">
          {/* In Studio */}
          <button
            type="button"
            aria-pressed={event.locationType === "studio"}
            onClick={() => handleLocationType("studio")}
            className={`rounded-full border py-3 text-lg font-medium transition-all ${
              event.locationType === "studio"
                ? "bg-accent text-dark border-primary shadow-md"
                : "bg-background text-dark border-gray hover:bg-accent/70"
            }`}
          >
            In Studio
          </button>

          {/* On-site */}
          <button
            type="button"
            aria-pressed={event.locationType === "onsite"}
            onClick={() => handleLocationType("onsite")}
            className={`rounded-full border py-3 text-lg font-medium transition-all ${
              event.locationType === "onsite"
                ? "bg-accent text-dark border-primary shadow-md"
                : "bg-background text-dark border-gray hover:bg-accent/70"
            }`}
          >
            On-site
          </button>
        </div>

        {event.locationType === "onsite" && (
          <div className="mt-3 space-y-2">
            <label
              htmlFor={`addr-${index}`}
              className="block text-sm font-medium text-heading"
            >
              On-site Address
            </label>
            <AddressAutocomplete
              inputId={`addr-${index}`}
              defaultValue={event.locationAddress}
              country="ca"
              onSelect={({ address, placeId }) => {
                onChange(index, "locationAddress", address);
                onChange(index, "locationPlaceId", placeId);
                // (optional) you can trigger a fee preview here by calling your API
              }}
            />
            <p className="text-xs text-muted">
              Exact address helps us estimate timing and any travel fees.
            </p>
          </div>
        )}

        {event.locationType === "studio" && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-muted">
              Located in Brampton, near Trinity Common Mall
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(EventCard);
