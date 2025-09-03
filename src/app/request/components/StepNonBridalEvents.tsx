"use client";
import type { EventData } from "../types";
import EventCard from "./EventCard";

interface Props {
  events: EventData[];
  setEvents: (events: EventData[]) => void;
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
  const handleEventChange = (
    index: number,
    field: keyof EventData,
    value: string
  ) => {
    const updated = [...events];
    updated[index][field] = value as any;
    setEvents(updated);
  };

  const handleServiceToggle = (index: number, service: string) => {
    const updated = [...events];
    const svc = updated[index].services;
    updated[index].services = svc.includes(service)
      ? svc.filter((s) => s !== service)
      : [...svc, service];
    setEvents(updated);
  };

  return (
    <>
      <h2 className="text-4xl font-serif text-heading mb-4 text-center">
        Tell us about each event
      </h2>
      <div className="space-y-8">
        {events.map((ev, idx) => (
          <EventCard
            key={idx}
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
          onClick={onBack}
          className="w-1/2 py-3 text-lg rounded-md border border-primary text-primary hover:bg-accent transition"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="w-1/2 py-3 text-lg rounded-md transition shadow bg-primary hover:bg-primaryHover text-light"
        >
          Next
        </button>
      </div>
    </>
  );
}
