"use client";
import React, { memo } from "react";
import type { EventData } from "@/types/request-types";
import { NonServiceField } from "@/types/request-types";

interface Props {
  index: number;
  event: EventData;
  today: string;
  onChange: (index: number, field: NonServiceField, value: string) => void;
  onToggleService: (index: number, service: string) => void;
}

function EventCard({ index, event, today, onChange, onToggleService }: Props) {
  const services = ["Makeup", "Hair"] as const;

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
    </div>
  );
}

export default memo(EventCard);
