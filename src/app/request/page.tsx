"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Step,
  type MakeupType,
  type EventData,
  type BridalEventData,
  type ContactInfo,
} from "@/types/request-types";
import StepSelectType from "@/components/request/StepSelectType";
import StepNonBridalCount from "@/components/request/StepNonBridalCount";
import StepNonBridalEvents from "@/components/request/StepNonBridalEvents";
import StepBridalEvents from "@/components/request/StepBridalEvents";
import StepContact from "@/components/request/StepContact";
import { useGoogleAddressAutocomplete } from "@/hooks/useGoogleAddressAutocomplete";
import { validateEventsComplete, validateBridalEventsComplete } from "@/lib/request/validation";
import { toast } from "sonner";
const toServiceCode = (s: string) =>
  s.trim().toLowerCase() as "makeup" | "hair" | "combo";

type ApiResponse =
  | {
      ok: true;
    }
  | {
      error: string;
    };

export default function RequestQuote() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(Step.SelectType);
  const [selected, setSelected] = useState<MakeupType | null>(null);
  const [eventCount, setEventCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const makeEvent = (): EventData => ({
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`, // fallback
    eventType: "",
    date: "",
    time: "",
    people: "",
    services: [],
    locationType: "studio", // default to studio
    locationAddress: "",
  });

  const [events, setEvents] = useState<EventData[]>([makeEvent()]);
  const makeBridalEvent = (): BridalEventData => ({
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`, // fallback
    eventType: "",
    date: "",
    time: "",
    locationType: "studio", // default to studio
    locationAddress: "",
  });
  const [bridalEvents, setBridalEvents] = useState<BridalEventData[]>([makeBridalEvent()]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const initEvents = (count: number) => {
    setEvents(Array.from({ length: count }, makeEvent));
    setStep(Step.NonBridalEvents);
  };

  const initBridalEvents = () => {
    // initialize with the currently selected eventCount
    setBridalEvents(Array.from({ length: eventCount }, makeBridalEvent));
    setStep(Step.BridalEvents);
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
    // For both Bridal and Non-Bridal we first ask how many events
    setStep(Step.NonBridalCount);
  };

  const goNextFromEvents = () => {
    if (!validateEventsComplete(events)) {
      toast.error("Please fill all fields for each event before continuing.");
      return;
    }
    setStep(Step.Contact);
  };

  const goNextFromBridalEvents = () => {
    if (!validateBridalEventsComplete(bridalEvents)) {
      toast.error("Please fill all fields for each event before continuing.");
      return;
    }
    setStep(Step.Contact);
  };

  const submitForm = async () => {
    if (!selected || isSubmitting) return;
    
    // Check reCAPTCHA
    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }

    setIsSubmitting(true);
    const minShowMs = 300;
    
    const payload = {
      serviceType: selected, // "Bridal" | "Non-Bridal"
      events: selected === "Bridal" 
        ? bridalEvents.map((e) => ({
            eventType: e.eventType.trim(),
            date: e.date,
            time: e.time,
            people: 1,
            locationType: e.locationType,
            locationAddress: e.locationAddress,
            services: ["makeup", "hair"], // Auto-include for bridal
          }))
        : events.map((e) => ({
            eventType: e.eventType.trim(),
            date: e.date,
            time: e.time,
            people: Number(e.people),
            locationType: e.locationType,
            locationAddress: e.locationAddress,
            services: e.services.map(toServiceCode),
          })),
      contact: {
        name: contactInfo.name.trim(),
        email: contactInfo.email.trim(),
        phone: contactInfo.phone.replace(/\D/g, ""), // digits only
        notes: contactInfo.notes?.trim() || undefined,
      },
      recaptchaToken,
    };

    try {
      const res = await fetch("/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse | null;

      if (!res.ok) {
        // Show user-friendly error messages instead of exposing internal details
        const msg = data && "error" in data
          ? data.error // Server now returns user-friendly messages
          : "Something went wrong. Please try again.";
        toast.error(msg);
        return;
      }

      if (data && "ok" in data && data.ok) {
        // Navigate to success page with service type parameter
        const serviceTypeParam = selected === "Bridal" ? "bridal" : "non-bridal";
        router.push(`/success?type=${serviceTypeParam}`);
      } else {
        toast.success("Request sent!");
      }
    } catch (err) {
      /* eslint-disable-next-line no-console */
      console.error(err);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
      // Reset reCAPTCHA
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <section className="bg-background pt-25 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="bg-white p-4 md:p-10 rounded-3xl shadow-lg max-w-lg w-full border border-gray space-y-8">
        {step === Step.SelectType && (
          <StepSelectType
            selected={selected}
            setSelected={(m) => setSelected(m)}
            onNext={goNextFromType}
          />
        )}

        {step === Step.NonBridalCount && (selected === "Non-Bridal" || selected === "Bridal") && (
          <StepNonBridalCount
            eventCount={eventCount}
            setEventCount={setEventCount}
            onBack={() => setStep(Step.SelectType)}
            onNext={() => (selected === "Bridal" ? initBridalEvents() : initEvents(eventCount))}
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

        {step === Step.BridalEvents && selected === "Bridal" && (
          <StepBridalEvents
            events={bridalEvents}
            setEvents={setBridalEvents}
            today={today}
            onBack={() => setStep(Step.NonBridalCount)}
            onNext={goNextFromBridalEvents}
          />
        )}

        {step === Step.Contact && (
          <StepContact
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
            onBack={() => 
              selected === "Bridal" 
                ? setStep(Step.BridalEvents)
                : setStep(Step.NonBridalEvents)
            }
            onSubmit={(ok) => ok && submitForm()}
            addressInputRef={addressInputRef}
            isSubmitting={isSubmitting}
            recaptchaToken={recaptchaToken}
            setRecaptchaToken={setRecaptchaToken}
            recaptchaRef={recaptchaRef as React.RefObject<ReCAPTCHA>}
          />
        )}

      </div>
    </section>
  );
}
