"use client";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import type { ContactInfo } from "@/types/request-types";
import { validateContact } from "@/lib/request/validation";

interface Props {
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;
  onBack: () => void;
  onSubmit: (payloadValid: boolean) => void;
  addressInputRef: React.RefObject<HTMLInputElement | null>;
  isSubmitting: boolean;
  recaptchaToken: string | null;
  setRecaptchaToken: (token: string | null) => void;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
}

export default function StepContact({
  contactInfo,
  setContactInfo,
  onBack,
  onSubmit,
  addressInputRef,
  isSubmitting,
  recaptchaToken,
  setRecaptchaToken,
  recaptchaRef,
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
          type="text"
          placeholder="Name"
          value={contactInfo.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full text-dark transition-colors"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={contactInfo.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full text-dark transition-colors"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={contactInfo.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full text-dark transition-colors"
        />
      </div>

      <textarea
        placeholder="Additional Notes (optional)"
        value={contactInfo.notes || ""}
        onChange={(e) => handleChange("notes", e.target.value)}
        className="w-full text-dark transition-colors"
        rows={4}
      />

      {/* reCAPTCHA */}
      <div className="flex justify-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
          onChange={setRecaptchaToken}
          onExpired={() => setRecaptchaToken(null)}
          onError={() => setRecaptchaToken(null)}
        />
      </div>

      <div className="mt-6 flex justify-between gap-4">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="w-1/2 text-lg border border-primary rounded-full text-primary hover:bg-accent"
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
          disabled={isSubmitting || !recaptchaToken}
          className="w-1/2 text-lg shadow bg-primary hover:bg-primaryHover text-light rounded-full"
        >
          <span className="flex items-center justify-center gap-2">
            {isSubmitting && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
          </span>
        </button>
      </div>
    </>
  );
}
