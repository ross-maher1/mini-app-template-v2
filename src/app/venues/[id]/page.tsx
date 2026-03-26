"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useVenues } from "@/contexts/VenueContext";
import { useGigs } from "@/contexts/GigContext";

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { venues } = useVenues();
  const { gigs } = useGigs();

  const venue = venues.find((v) => v.id === id);

  if (!venue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-purple-300 flex items-center justify-center">
        <div className="text-white text-xl">Venue not found</div>
      </div>
    );
  }

  const venueGigs = gigs.filter((gig) => venue.gigs.includes(gig.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-purple-300 pb-28">
      <div className="p-6">
        {/* Back button */}
        <button
          onClick={() => router.push("/venues")}
          className="mb-4 p-2 hover:bg-white/20 rounded-lg transition-colors inline-flex items-center gap-2 text-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-sm text-gray-700">
            {venue.type} | {venue.capacity}
          </div>
          <div className="text-right text-gray-700 text-sm">
            Played {venue.playedCount}
          </div>
        </div>

        {/* Venue Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{venue.name}</h1>
        <div className="text-sm text-gray-700 mb-6">
          {venue.streetAddress} | {venue.suburb} | {venue.city} | {venue.state}
        </div>

        {/* Description and Profile Picture */}
        <div className="flex gap-4 mb-6">
          <p className="flex-1 text-sm text-gray-800 leading-relaxed">
            {venue.description}
          </p>
          <div className="w-20 h-20 rounded-full bg-white/50 flex-shrink-0" />
        </div>

        <div className="border-b border-dashed border-gray-400 mb-6" />

        {/* Contact Details */}
        <div className="space-y-2 text-sm text-gray-800 mb-4">
          <div>
            <span className="font-medium">email</span> | {venue.email}
          </div>
          <div>
            <span className="font-medium">ABN</span> | {venue.abn}
          </div>
          <div>
            <span className="font-medium">address</span>
          </div>
          <div>
            <span className="font-medium">phone</span> | {venue.phone}
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-1 text-sm text-gray-800 mb-4">
          {venue.facebook && (
            <div>
              <span className="font-medium">Facebook</span> | {venue.facebook}
            </div>
          )}
          {venue.website && (
            <div>
              <span className="font-medium">Website</span> | {venue.website}
            </div>
          )}
          {venue.spotify && (
            <div>
              <span className="font-medium">Spotify</span> | {venue.spotify}
            </div>
          )}
        </div>

        <button className="text-2xl text-gray-800 mb-6">+</button>

        {/* Map Placeholder */}
        <div className="mb-6">
          <div className="w-full h-48 rounded-lg bg-white/30 flex items-center justify-center text-gray-500">
            Map placeholder
          </div>
        </div>

        <div className="border-b border-dashed border-gray-400 mb-6" />

        {/* Gigs List */}
        <div className="space-y-0">
          {venueGigs.map((gig, index) => (
            <div key={gig.id}>
              <button
                onClick={() => router.push(`/gigs/${gig.id}`)}
                className="w-full text-left py-4 hover:bg-white/20 transition-colors"
              >
                <div className="flex justify-end mb-2">
                  <div className="px-6 py-1 rounded-full text-xs font-medium border-2 bg-orange-400 text-gray-900 border-orange-500">
                    {gig.status}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-700 mb-1">
                    {gig.date} | {gig.time}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1 italic">
                    {gig.title}
                  </h3>
                  <div className="text-sm text-gray-700">
                    {gig.act} | {gig.tour && `${gig.tour} | `}
                    {gig.venue} | {gig.city}
                  </div>
                </div>
              </button>
              {index < venueGigs.length - 1 && (
                <div className="border-b border-dashed border-gray-400" />
              )}
            </div>
          ))}
        </div>

        {venueGigs.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No gigs scheduled at this venue
          </div>
        )}
      </div>
    </div>
  );
}
