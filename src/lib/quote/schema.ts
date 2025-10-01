import { z } from "zod";

export const EventSchema = z.object({
  eventType: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  people: z.coerce.number().int().min(1).max(50),
  services: z.array(z.enum(["makeup", "hair", "combo"])),
});

export const QuoteSchema = z.object({
  serviceType: z.enum(["Bridal", "Non-Bridal"]),
  events: z.array(EventSchema).min(1).max(5),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(7),
    notes: z.string().optional(),
  }),
  recaptchaToken: z.string().min(1),
});
