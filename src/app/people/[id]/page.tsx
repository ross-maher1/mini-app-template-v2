"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useGigs } from "@/contexts/GigContext";
import { mockPersonDetails } from "@/lib/data";
import { StatusDropdown } from "@/components/gigs/StatusDropdown";

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getGigsForPerson } = useGigs();

  const person = mockPersonDetails[id];
  const assignedGigs = getGigsForPerson(id);

  const displayGigs = assignedGigs.map((gig) => ({
    id: gig.id,
    date: gig.date,
    time: gig.time,
    title: gig.title,
    details: `${gig.act} | ${gig.venue} | ${gig.city}`,
    status: gig.status,
  }));

  if (!person) {
    return (
      <main className="space-y-6">
        <button
          onClick={() => router.push("/people")}
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          People
        </button>
        <div className="text-center py-12 text-slate-500 text-sm">
          Person not found
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push("/people")}
        className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        People
      </button>

      {/* Stats */}
      <div className="flex justify-end">
        <div className="text-right text-sm text-slate-500 space-y-0.5">
          <div>Upcoming | {person.upcomingGigs.toString().padStart(2, "0")}</div>
          <div>
            To Reconcile | {person.toReconcile.toString().padStart(2, "0")}
          </div>
          <div>
            All Time | {person.allTimeGigs.toString().padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm text-center space-y-3">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200" />
        </div>
        <div className="text-xs text-slate-500">{person.location}</div>
        <h1 className="type-h1">{person.name}</h1>
        <div className="text-sm text-slate-500">
          {person.roles.join(" | ")}
        </div>
      </div>

      {/* Bands Card */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
        <h2 className="type-item-title text-base mb-3">Bands</h2>
        <div className="space-y-1">
          {person.bands.map((band, index) => (
            <div key={index} className="text-sm text-slate-600">
              {band}
            </div>
          ))}
        </div>
      </div>

      {/* Gigs */}
      {displayGigs.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white/85 shadow-sm divide-y divide-dashed divide-slate-200">
          {displayGigs.map((gig) => (
            <button
              key={gig.id}
              onClick={() => router.push(`/gigs/${gig.id}`)}
              className="w-full text-left px-5 py-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex justify-end mb-1.5">
                <StatusDropdown
                  currentStatus={gig.status}
                  onStatusChange={() => {}}
                />
              </div>
              <div className="text-xs text-slate-500 mb-1">
                {gig.date} | {gig.time}
              </div>
              <h3 className="type-item-title text-base mb-0.5">
                {gig.title}
              </h3>
              <div className="text-sm text-slate-500">{gig.details}</div>
            </button>
          ))}
        </div>
      )}

      {displayGigs.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-sm">
          No gigs assigned to this person yet
        </div>
      )}
    </main>
  );
}
