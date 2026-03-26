"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useVenues } from "@/contexts/VenueContext";
import { useGigs } from "@/contexts/GigContext";
import { StatusDropdown } from "@/components/gigs/StatusDropdown";

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { venues } = useVenues();
  const { gigs } = useGigs();

  const venue = venues.find((v) => v.id === id);

  if (!venue) {
    return (
      <main className="space-y-6">
        <div className="text-center py-12 text-slate-500 text-sm">
          Venue not found
        </div>
      </main>
    );
  }

  const venueGigs = gigs.filter((gig) => venue.gigs.includes(gig.id));

  return (
    <main className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push("/venues")}
        className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        Venues
      </button>

      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <p className="type-meta">
            {venue.type} | {venue.capacity}
          </p>
          <h1 className="type-h1">{venue.name}</h1>
          <p className="type-lead">
            {venue.streetAddress} | {venue.suburb} | {venue.city} |{" "}
            {venue.state}
          </p>
        </div>
        <div className="text-right text-sm text-slate-500">
          Played {venue.playedCount}
        </div>
      </div>

      {/* Description Card */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
        <div className="flex gap-4">
          <p className="flex-1 text-sm text-slate-600 leading-relaxed">
            {venue.description}
          </p>
          <div className="w-16 h-16 rounded-full bg-slate-100 flex-shrink-0" />
        </div>
      </div>

      {/* Contact Card */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm space-y-2 text-sm text-slate-700">
        <div>
          <span className="font-medium text-slate-500">email</span> |{" "}
          {venue.email}
        </div>
        <div>
          <span className="font-medium text-slate-500">ABN</span> |{" "}
          {venue.abn}
        </div>
        <div>
          <span className="font-medium text-slate-500">phone</span> |{" "}
          {venue.phone}
        </div>
        {venue.facebook && (
          <div>
            <span className="font-medium text-slate-500">Facebook</span> |{" "}
            {venue.facebook}
          </div>
        )}
        {venue.website && (
          <div>
            <span className="font-medium text-slate-500">Website</span> |{" "}
            {venue.website}
          </div>
        )}
        {venue.spotify && (
          <div>
            <span className="font-medium text-slate-500">Spotify</span> |{" "}
            {venue.spotify}
          </div>
        )}
      </div>

      {/* Map Placeholder */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 shadow-sm overflow-hidden">
        <div className="w-full h-48 flex items-center justify-center text-slate-400 text-sm">
          Map placeholder
        </div>
      </div>

      {/* Gigs at this Venue */}
      {venueGigs.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white/85 shadow-sm divide-y divide-dashed divide-slate-200">
          {venueGigs.map((gig) => (
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
              <div className="text-sm text-slate-500">
                {gig.act} | {gig.tour && `${gig.tour} | `}
                {gig.venue} | {gig.city}
              </div>
            </button>
          ))}
        </div>
      )}

      {venueGigs.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-sm">
          No gigs scheduled at this venue
        </div>
      )}
    </main>
  );
}
