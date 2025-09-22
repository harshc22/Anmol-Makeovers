export type MakeupType = "Bridal" | "Non-Bridal";

export interface EventData {
  id: string; 
  eventType: string;
  date: string;
  time: string;
  location: string;
  people: string;
  services: string[];
}

export interface BridalEventData {
  id: string; 
  eventType: string;
  date: string;
  time: string;
  location: string;
  // No services field - bridal automatically includes makeup and hair
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

export enum Step {
  SelectType = 1,
  NonBridalCount = 2,
  NonBridalEvents = 3,
  BridalEvents = 4,
  Contact = 5,
}
export type NonServiceField =
  | "eventType"
  | "date"
  | "time"
  | "location"
  | "people";

export type BridalEventField =
  | "eventType"
  | "date"
  | "time"
  | "location"
  ;
