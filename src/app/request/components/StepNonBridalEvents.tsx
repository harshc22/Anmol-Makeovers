"use client";
import React, { useCallback } from "react";
import type { EventData } from "../types";
import EventCard from "./EventCard";
import { NonServiceField } from "../types";

interface Props {
  events: EventData[];
  // important: make this a real React state setter
  setEvents: React.Dispatch<React.SetStateAction<EventData[]>>;
  today: string;
  onBack: () => void;
  onNext: () => void;
}

export default function StepNonBridalEvents({
  events,
  setEvents,
  today,
  onBack,
  onNext,
}: Props) {
  const handleEventChange = useCallback(
    (index: number, field: NonServiceField, value: string) => {
      setEvents((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    },
    [setEvents]
  );

  const handleServiceToggle = useCallback(
    (index: number, service: string) => {
      setEvents((prev) => {
        const next = [...prev];
        const svcs = next[index].services;
        next[index] = {
          ...next[index],
          services: svcs.includes(service)
            ? svcs.filter((s) => s !== service)
            : [...svcs, service],
        };
        return next;
      });
    },
    [setEvents]
  );

  return (
    <>
      <h2 className="text-4xl font-serif text-heading mb-4 text-center">
        Tell us about each event
      </h2>

      <div className="space-y-8">
        {events.map((ev, idx) => (
          <EventCard
            key={ev.id}
            index={idx}
            event={ev}
            today={today}
            onChange={handleEventChange}
            onToggleService={handleServiceToggle}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 py-3 text-lg rounded-md border border-primary text-primary hover:bg-accent transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="w-1/2 py-3 text-lg rounded-md transition shadow bg-primary hover:bg-primaryHover text-light"
        >
          Next
        </button>
      </div>
    </>
  );
}
