/**
 * Core type definitions for the Gig Management app.
 */

// Kept for demo page compatibility
export type DemoNote = {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
};

export type VenueStatus = "TBC" | "CONFIRMED" | "CANCELLED";

export type PersonStatus = "TBC" | "Confirmed" | "Declined";

export type PersonRole = "Guitar" | "Bass" | "Drums" | "Engineer" | "Support";

export type GigStatus =
  | "UPCOMING"
  | "TBC"
  | "CONFIRMED"
  | "ANNOUNCED"
  | "TO RECONCILE"
  | "INVOICED"
  | "RECONCILED"
  | "CANCELLED";

export interface Person {
  id: string;
  role: string;
  name: string;
  status: PersonStatus;
  fee: string;
}

export interface Money {
  gigFee: string;
  playerFees: string;
  supports: string;
  promo: string;
  rehearsal: string;
  production: string;
  travel: string;
  other: string;
  gst: string;
  superPayable: string;
  profitLoss: string;
}

export interface Doc {
  id: string;
  name: string;
  type:
    | "Worksheet"
    | "Setlist"
    | "Stage Plot"
    | "Gig Artwork"
    | "Invoice"
    | "Other";
  completed: boolean;
}

export interface GigLink {
  id: string;
  name: string;
  type:
    | "Tickets"
    | "Facebook event"
    | "Press Release"
    | "Promo Video"
    | "Other";
  url: string;
}

export interface Venue {
  id: string;
  name: string;
  type: string;
  capacity: string;
  area: string;
  city: string;
  state: string;
  streetAddress: string;
  suburb: string;
  description: string;
  email: string;
  abn: string;
  phone: string;
  facebook?: string;
  website?: string;
  spotify?: string;
  gigs: string[];
  playedCount: number;
  isFavorite: boolean;
}

export interface Gig {
  id: string;
  title: string;
  date: string;
  time: string;
  act: string;
  tour?: string;
  venue: string;
  city: string;
  status: GigStatus;
  description: string;
  people: Person[];
  money: Money;
  docs: Doc[];
  links: GigLink[];
}

export interface MockPerson {
  id: string;
  name: string;
  role: string;
  type: "Band" | "Crew" | "Other";
  phone?: string;
  email?: string;
}

export interface PersonDetailData {
  id: string;
  name: string;
  location: string;
  roles: string[];
  bands: string[];
  upcomingGigs: number;
  toReconcile: number;
  allTimeGigs: number;
}
