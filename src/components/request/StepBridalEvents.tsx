"use client";
import React, { useCallback } from "react";
import type { BridalEventData } from "@/types/request-types";
import BridalEventCard from "./BridalEventCard";
import { BridalEventField } from "@/types/request-types";

interface Props {
  events: BridalEventData[];
  setEvents: React.Dispatch<React.SetStateAction<BridalEventData[]>>;
  today: string;
  onBack: () => void;
  onNext: () => void;
}

export default function StepBridalEvents({
  events,
  setEvents,
  today,
  onBack,
  onNext,
}: Props) {
  const handleEventChange = useCallback(
    (index: number, field: BridalEventField, value: string) => {
      setEvents((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
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

      <div className="border border-gray rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-2 text-primary">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Services Included</span>
        </div>
        <p className="text-sm text-dark mt-2">
          Makeup and Hair services are automatically included
        </p>
      </div>

      <div className="space-y-8">
        {events.map((ev, idx) => (
          <BridalEventCard
            key={ev.id}
            index={idx}
            event={ev}
            today={today}
            onChange={handleEventChange}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 py-3 text-lg rounded-full border border-primary text-primary hover:bg-accent transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="w-1/2 py-3 text-lg rounded-full transition shadow bg-primary hover:bg-primaryHover text-light"
        >
          Next
        </button>
      </div>
    </>
  );
}
