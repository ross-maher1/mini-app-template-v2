"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useGigs } from "@/contexts/GigContext";
import { mockPersonDetails } from "@/lib/data";

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
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-purple-300 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Person not found
          </h1>
          <button
            onClick={() => router.push("/people")}
            className="px-6 py-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            Back to People
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-purple-300 pb-28">
      <div className="p-6">
        {/* Back button */}
        <button
          onClick={() => router.push("/people")}
          className="mb-4 p-2 hover:bg-white/20 rounded-lg transition-colors inline-flex items-center gap-2 text-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Stats Header */}
        <div className="text-white text-sm mb-6">
          Upcoming gigs ({person.upcomingGigs}) | To Reconcile (
          {person.toReconcile}) | All time gigs ({person.allTimeGigs})
        </div>

        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full bg-white border-4 border-gray-300" />
        </div>

        {/* Location */}
        <div className="text-center text-gray-800 mb-2">{person.location}</div>

        {/* Name */}
        <h1 className="text-5xl font-bold italic text-gray-900 text-center mb-3">
          {person.name}
        </h1>

        {/* Roles */}
        <div className="text-center text-gray-800 mb-6">
          {person.roles.join(" | ")}
        </div>

        <div className="border-b border-dashed border-gray-400 mb-6" />

        {/* Bands Section */}
        <div className="text-center mb-6">
          {person.bands.map((band, index) => (
            <div key={index} className="text-gray-800 mb-1">
              {band}
            </div>
          ))}
        </div>

        <div className="border-b border-dashed border-gray-400 mb-6" />

        {/* Gigs List */}
        <div className="space-y-6">
          {displayGigs.map((gig, index) => (
            <div
              key={gig.id}
              onClick={() => router.push(`/gigs/${gig.id}`)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="flex justify-between items-start gap-4 mb-2">
                <div className="flex-1">
                  <div className="text-sm text-gray-700 mb-1">
                    {gig.date} | {gig.time}
                  </div>
                  <h2 className="text-3xl font-bold italic text-gray-900 mb-1">
                    {gig.title}
                  </h2>
                  <div className="text-sm text-gray-700">{gig.details}</div>
                </div>
                <div className="bg-[#f5a623] px-6 py-2 rounded-full">
                  <span className="text-sm font-bold text-gray-900">
                    {gig.status}
                  </span>
                </div>
              </div>
              {index < displayGigs.length - 1 && (
                <div className="border-b border-dashed border-gray-400 mt-6" />
              )}
            </div>
          ))}
        </div>

        {displayGigs.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No gigs assigned to this person yet
          </div>
        )}
      </div>
    </div>
  );
}
