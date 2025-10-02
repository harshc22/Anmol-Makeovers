export type MakeupType = "Bridal" | "Non-Bridal";
export type ReadyLocationType = "studio" | "onsite";

export interface EventData {
  id: string; 
  eventType: string;
  date: string;
  time: string;
  people: string;
  services: string[];
  locationType: ReadyLocationType;   
  locationAddress: string; 
}

export interface BridalEventData {
  id: string; 
  eventType: string;
  date: string;
  time: string;
  locationType: ReadyLocationType;
  locationAddress: string;        
  // No services field - bridal automatically includes makeup and hair
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
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
  | "people"
  | "locationType" 
  | "locationAddress"; 

export type BridalEventField =
  | "eventType"
  | "date"
  | "time"
  | "locationType"
  | "locationAddress"
  ;
