"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Star } from "lucide-react";
import { useVenues } from "@/contexts/VenueContext";

export default function VenueListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { venues, updateVenueFavorite } = useVenues();

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      return (
        searchQuery === "" ||
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [venues, searchQuery]);

  const totalPlayed = useMemo(() => {
    return venues.reduce((sum, venue) => sum + venue.playedCount, 0);
  }, [venues]);

  const handleToggleFavorite = (
    e: React.MouseEvent,
    venueId: string,
    currentFavorite: boolean
  ) => {
    e.stopPropagation();
    updateVenueFavorite(venueId, !currentFavorite);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-purple-300">
      <div className="p-6 pb-28">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-5xl font-bold text-white">Venues</h1>
          <div className="text-right text-white text-sm">
            <div>Played: {totalPlayed}</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or tag"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 backdrop-blur text-gray-900 placeholder:text-gray-500 placeholder:italic"
          />
        </div>

        {/* Venue List */}
        <div className="space-y-0">
          {filteredVenues.map((venue, index) => (
            <div key={venue.id}>
              <div className="w-full text-left py-4 hover:bg-white/20 transition-colors group relative">
                <button
                  onClick={() => router.push(`/venues/${venue.id}`)}
                  className="absolute inset-0"
                  aria-label={`View ${venue.name}`}
                />
                <div className="flex justify-between items-start gap-4 relative">
                  <div className="flex-1 pointer-events-none">
                    <div className="text-xs text-gray-700 mb-1">
                      {venue.area} | {venue.city} | {venue.state}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1 italic">
                      {venue.name}
                    </h2>
                    <div className="text-sm text-gray-700">
                      {venue.type} | {venue.capacity}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pointer-events-auto relative z-10">
                    <div className="px-6 py-1 rounded-full text-xs font-medium border-2 bg-orange-400 text-gray-900 border-orange-500">
                      TBC
                    </div>
                    <button
                      onClick={(e) =>
                        handleToggleFavorite(e, venue.id, venue.isFavorite)
                      }
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          venue.isFavorite
                            ? "fill-gray-900 text-gray-900"
                            : "text-gray-900"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              {index < filteredVenues.length - 1 && (
                <div className="border-b border-dashed border-gray-400" />
              )}
            </div>
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            No venues found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
