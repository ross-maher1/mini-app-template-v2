"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Venue } from "@/lib/types";
import { mockVenues } from "@/lib/data";

interface VenueContextType {
  venues: Venue[];
  updateVenueFavorite: (id: string, isFavorite: boolean) => void;
}

const VenueContext = createContext<VenueContextType | undefined>(undefined);

export function VenueProvider({ children }: { children: ReactNode }) {
  const [venues, setVenues] = useState<Venue[]>(mockVenues);

  const updateVenueFavorite = (id: string, isFavorite: boolean) => {
    setVenues((prev) =>
      prev.map((venue) =>
        venue.id === id ? { ...venue, isFavorite } : venue
      )
    );
  };

  return (
    <VenueContext.Provider value={{ venues, updateVenueFavorite }}>
      {children}
    </VenueContext.Provider>
  );
}

export function useVenues() {
  const context = useContext(VenueContext);
  if (context === undefined) {
    throw new Error("useVenues must be used within a VenueProvider");
  }
  return context;
}
