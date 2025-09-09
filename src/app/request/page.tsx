"use client";
import { useRef, useState } from "react";
import {
  Step,
  type MakeupType,
  type EventData,
  type ContactInfo,
} from "./types";
import StepSelectType from "./components/StepSelectType";
import StepNonBridalCount from "./components/StepNonBridalCount";
import StepNonBridalEvents from "./components/StepNonBridalEvents";
import StepContact from "./components/StepContact";
import { useGoogleAddressAutocomplete } from "./hooks/useGoogleAddressAutocomplete";
import { validateEventsComplete } from "./utils/validation";
import { toast } from "sonner";
import type { ZodIssue } from "zod";

const toServiceCode = (s: string) =>
  s.trim().toLowerCase() as "makeup" | "hair" | "combo";

type ApiResponse =
  | {
      ok: true;
      total_cents: number;
      total_formatted: string;
      breakdown: unknown;
    }
  | {
      error: string;
      details?: ZodIssue[];
    };

function isZodIssueArray(x: unknown): x is ZodIssue[] {
  return (
    Array.isArray(x) &&
    x.every(
      (i) =>
        i &&
        typeof i === "object" &&
        "message" in (i as Record<string, unknown>)
    )
  );
}

function formatIssues(issues: ZodIssue[]): string {
  return issues
    .map((d) => {
      const path = Array.isArray(d.path) ? d.path.join(".") : "";
      return `${path ? `${path}: ` : ""}${d.message}`;
    })
    .join("; ");
}

export default function RequestQuote() {
  const [step, setStep] = useState<Step>(Step.SelectType);
  const [selected, setSelected] = useState<MakeupType | null>(null);
  const [eventCount, setEventCount] = useState(1);
  const makeEvent = (): EventData => ({
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`, // fallback
    eventType: "",
    date: "",
    time: "",
    location: "",
    people: "",
    services: [],
  });

  const [events, setEvents] = useState<EventData[]>([makeEvent()]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const initEvents = (count: number) => {
    setEvents(Array.from({ length: count }, makeEvent));
    setStep(Step.NonBridalEvents);
  };

  const today = new Date().toISOString().split("T")[0];
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  useGoogleAddressAutocomplete(
    step,
    contactInfo,
    (updater) => setContactInfo(updater(contactInfo)),
    addressInputRef
  );

  // navigation handlers
  const goNextFromType = () => {
    if (!selected) return;
    setStep(Step.NonBridalCount);
  };

  const goNextFromEvents = () => {
    if (!validateEventsComplete(events)) {
      toast.error("Please fill all fields for each event before continuing.");
      return;
    }
    setStep(Step.Contact);
  };

  const submitForm = async () => {
    if (!selected) return;
    const payload = {
      serviceType: selected, // "Bridal" | "Non-Bridal"
      events: events.map((e) => ({
        eventType: e.eventType.trim(),
        date: e.date,
        time: e.time,
        location: (e.location || contactInfo.address).trim(),
        people: Number(e.people),
        services: e.services.map(toServiceCode),
      })),
      contact: {
        email: contactInfo.email.trim(),
        phone: contactInfo.phone.replace(/\D/g, ""), // digits only
        address: contactInfo.address.trim(),
        notes: contactInfo.notes?.trim() || undefined,
      },
    };

    try {
      // If your API route lives at /api/quote, change this to "/api/quote"
      const res = await fetch("/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse | null;

      if (!res.ok) {
        const msg =
          data && "details" in data && isZodIssueArray(data.details)
            ? `Invalid: ${formatIssues(data.details)}`
            : data && "error" in data
            ? data.error
            : "Something went wrong. Please try again.";
        toast.error(msg);
        return;
      }

      if (data && "ok" in data && data.ok) {
        toast.success(`Request sent! Total: ${data.total_formatted}`);
      } else {
        toast.success("Request sent!");
      }
    } catch (err) {
      /* eslint-disable-next-line no-console */
      console.error(err);
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <section className="bg-background pt-25 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="bg-white p-10 rounded-3xl shadow-lg max-w-lg w-full border border-gray space-y-8">
        {step === Step.SelectType && (
          <StepSelectType
            selected={selected}
            setSelected={(m) => setSelected(m)}
            onNext={goNextFromType}
          />
        )}

        {step === Step.NonBridalCount && selected === "Non-Bridal" && (
          <StepNonBridalCount
            eventCount={eventCount}
            setEventCount={setEventCount}
            onBack={() => setStep(Step.SelectType)}
            onNext={() => initEvents(eventCount)}
          />
        )}

        {step === Step.NonBridalEvents && selected === "Non-Bridal" && (
          <StepNonBridalEvents
            events={events}
            setEvents={setEvents}
            today={today}
            onBack={() => setStep(Step.NonBridalCount)}
            onNext={goNextFromEvents}
          />
        )}

        {step === Step.Contact && (
          <StepContact
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
            onBack={() => setStep(Step.NonBridalEvents)}
            onSubmit={(ok) => ok && submitForm()}
            addressInputRef={addressInputRef}
          />
        )}

        {/* Bridal flow component can be added later with its own steps */}
      </div>
    </section>
  );
}
