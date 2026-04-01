"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Gig, GigStatus, PersonStatus } from "@/lib/types";
import { mockGigs } from "@/lib/data";

export interface PersonAssignment {
  personId: string;
  personName: string;
  personRole: string;
}

interface GigContextType {
  gigs: Gig[];
  updateGigStatus: (gigId: string, newStatus: GigStatus) => void;
  updateGigDateTime: (gigId: string, date: string, time: string) => void;
  updateGigVenue: (gigId: string, venueName: string, city: string) => void;
  updateGigMoney: (gigId: string, field: keyof Gig["money"], value: string) => void;
  updateGigPersonRole: (gigId: string, personId: string, newRole: string) => void;
  updateGigPersonStatus: (gigId: string, personId: string, newStatus: PersonStatus) => void;
  updateGigPersonFee: (gigId: string, personId: string, fee: string) => void;
  removePersonFromGig: (gigId: string, personId: string) => void;
  addPersonToGig: (gigId: string) => void;
  personAssignments: Record<string, Record<string, PersonAssignment>>;
  assignPersonToGig: (gigId: string, roleId: string, person: PersonAssignment) => void;
  getGigsForPerson: (personId: string) => Gig[];
}

const GigContext = createContext<GigContextType | undefined>(undefined);

export function GigProvider({ children }: { children: ReactNode }) {
  const [gigs, setGigs] = useState<Gig[]>(mockGigs);
  const [personAssignments, setPersonAssignments] = useState<
    Record<string, Record<string, PersonAssignment>>
  >({});

  const updateGigStatus = (gigId: string, newStatus: GigStatus) => {
    setGigs((prev) =>
      prev.map((gig) => (gig.id === gigId ? { ...gig, status: newStatus } : gig))
    );
  };

  const updateGigDateTime = (gigId: string, date: string, time: string) => {
    setGigs((prev) =>
      prev.map((gig) => (gig.id === gigId ? { ...gig, date, time } : gig))
    );
  };

  const updateGigVenue = (gigId: string, venueName: string, city: string) => {
    setGigs((prev) =>
      prev.map((gig) =>
        gig.id === gigId ? { ...gig, venue: venueName, city } : gig
      )
    );
  };

  const updateGigMoney = (
    gigId: string,
    field: keyof Gig["money"],
    value: string
  ) => {
    setGigs((prev) =>
      prev.map((gig) =>
        gig.id === gigId
          ? { ...gig, money: { ...gig.money, [field]: value } }
          : gig
      )
    );
  };

  const updateGigPersonRole = (
    gigId: string,
    personId: string,
    newRole: string
  ) => {
    setGigs((prev) =>
      prev.map((gig) =>
        gig.id === gigId
          ? {
              ...gig,
              people: gig.people.map((person) =>
                person.id === personId ? { ...person, role: newRole } : person
              ),
            }
          : gig
      )
    );
  };

  const updateGigPersonStatus = (
    gigId: string,
    personId: string,
    newStatus: PersonStatus
  ) => {
    setGigs((prev) =>
      prev.map((gig) =>
        gig.id === gigId
          ? {
              ...gig,
              people: gig.people.map((person) =>
                person.id === personId
                  ? { ...person, status: newStatus }
                  : person
              ),
            }
          : gig
      )
    );
  };

  const updateGigPersonFee = (
    gigId: string,
    personId: string,
    fee: string
  ) => {
    setGigs((prev) =>
      prev.map((gig) =>
        gig.id === gigId
          ? {
              ...gig,
              people: gig.people.map((person) =>
                person.id === personId ? { ...person, fee } : person
              ),
            }
          : gig
      )
    );
  };

  const removePersonFromGig = (gigId: string, personId: string) => {
    setGigs((prev) =>
      prev.map((gig) =>
        gig.id === gigId
          ? {
              ...gig,
              people: gig.people.filter((person) => person.id !== personId),
            }
          : gig
      )
    );
  };

  const addPersonToGig = (gigId: string) => {
    setGigs((prev) =>
      prev.map((gig) =>
        gig.id === gigId
          ? {
              ...gig,
              people: [
                ...gig.people,
                {
                  id: `person-${Date.now()}-${Math.random()}`,
                  name: "Name Surname",
                  role: "Other",
                  status: "TBC" as PersonStatus,
                  fee: "",
                },
              ],
            }
          : gig
      )
    );
  };

  const assignPersonToGig = (
    gigId: string,
    roleId: string,
    person: PersonAssignment
  ) => {
    setPersonAssignments((prev) => ({
      ...prev,
      [gigId]: {
        ...(prev[gigId] || {}),
        [roleId]: person,
      },
    }));
  };

  const getGigsForPerson = (personId: string): Gig[] => {
    const gigsForPerson: Gig[] = [];
    Object.entries(personAssignments).forEach(([gigId, roles]) => {
      const isAssigned = Object.values(roles).some(
        (assignment) => assignment.personId === personId
      );
      if (isAssigned) {
        const gig = gigs.find((g) => g.id === gigId);
        if (gig) gigsForPerson.push(gig);
      }
    });
    return gigsForPerson;
  };

  return (
    <GigContext.Provider
      value={{
        gigs,
        updateGigStatus,
        updateGigDateTime,
        updateGigVenue,
        updateGigMoney,
        updateGigPersonRole,
        updateGigPersonStatus,
        updateGigPersonFee,
        removePersonFromGig,
        addPersonToGig,
        personAssignments,
        assignPersonToGig,
        getGigsForPerson,
      }}
    >
      {children}
    </GigContext.Provider>
  );
}

export function useGigs() {
  const context = useContext(GigContext);
  if (!context) {
    throw new Error("useGigs must be used within a GigProvider");
  }
  return context;
}
