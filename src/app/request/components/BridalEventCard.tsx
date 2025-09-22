"use client";
import React, { memo } from "react";
import type { BridalEventData } from "../types";
import { BridalEventField } from "../types";

interface Props {
  index: number;
  event: BridalEventData;
  today: string;
  onChange: (index: number, field: BridalEventField, value: string) => void;
}

function BridalEventCard({ index, event, today, onChange }: Props) {
  return (
    <div className="border border-gray rounded-xl p-6 space-y-4">
      <h3 className="text-xl font-semibold text-heading">Event {index + 1}</h3>

      <input
        type="text"
        placeholder="Event Name"
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

      {/* Number of people is fixed to 1 for bridal events (the bride) */}

    </div>
  );
}

export default memo(BridalEventCard);
