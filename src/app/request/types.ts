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
  Contact = 4,
}
export type NonServiceField =
  | "eventType"
  | "date"
  | "time"
  | "location"
  | "people";
