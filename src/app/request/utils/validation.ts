import type { ContactInfo, EventData } from "../types";

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneDigitsRegex = /^[0-9]{10,15}$/;

export function validateEventsComplete(events: EventData[]): boolean {
  return events.every(
    (ev) =>
      ev.eventType.trim() &&
      ev.date.trim() &&
      ev.time.trim() &&
      ev.people &&
      ev.services.length > 0
  );
}

export function validateContact(info: ContactInfo): string | null {
  if (!info.email || !emailRegex.test(info.email))
    return "Please enter a valid email address.";
  const digits = info.phone.replace(/\D/g, "");
  if (!digits || !phoneDigitsRegex.test(digits))
    return "Please enter a valid phone number.";
  if (!info.address.trim()) return "Please enter your street address.";
  return null;
}
