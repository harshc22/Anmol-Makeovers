"use client";
import { toast } from "sonner";
import type { ContactInfo } from "../types";
import { validateContact } from "../utils/validation";

interface Props {
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;
  onBack: () => void;
  onSubmit: (payloadValid: boolean) => void;
  addressInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function StepContact({
  contactInfo,
  setContactInfo,
  onBack,
  onSubmit,
  addressInputRef,
}: Props) {
  const handleChange = (field: keyof ContactInfo, value: string) =>
    setContactInfo({ ...contactInfo, [field]: value });

  return (
    <>
      <h2 className="text-3xl sm:text-4xl font-serif text-heading mb-4 text-center">
        Contact Info
      </h2>
      <p className="text-dark text-center mb-6 text-base">
        We’ll use this info to follow up with your quote.
      </p>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          value={contactInfo.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full px-4 py-4 rounded-md border border-gray bg-background text-dark text-base focus:outline-none focus:border-primary transition"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={contactInfo.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full px-4 py-4 rounded-md border border-gray bg-background text-dark text-base focus:outline-none focus:border-primary transition"
        />
        <input
          type="text"
          placeholder="Street Address"
          ref={addressInputRef}
          value={contactInfo.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className="w-full px-4 py-4 rounded-md border border-gray bg-background text-dark text-base focus:outline-none focus:border-primary transition"
        />
      </div>

      <textarea
        placeholder="Additional Notes (optional)"
        value={contactInfo.notes || ""}
        onChange={(e) => handleChange("notes", e.target.value)}
        className="w-full px-4 py-4 rounded-md border border-gray bg-background text-dark text-base focus:outline-none focus:border-primary transition"
        rows={4}
      />

      <div className="mt-6 flex justify-between gap-4">
        <button
          onClick={onBack}
          className="w-1/2 py-3 text-lg rounded-md border border-primary text-primary hover:bg-accent transition"
        >
          Back
        </button>
        <button
          onClick={() => {
            const err = validateContact(contactInfo);
            if (err) {
              toast.error(err);
              onSubmit(false);
              return;
            }
            onSubmit(true);
          }}
          className="w-1/2 py-3 text-lg rounded-md transition shadow bg-primary hover:bg-primaryHover text-light"
        >
          Submit
        </button>
      </div>
    </>
  );
}
