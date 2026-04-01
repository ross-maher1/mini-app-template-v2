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
    <main className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <p className="type-meta">Directory</p>
          <h1 className="type-h1">Venues</h1>
        </div>
        <div className="text-right text-sm text-slate-500">
          <div>Played | {totalPlayed.toString().padStart(2, "0")}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by name or tag"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/85 text-slate-900 placeholder:text-slate-400 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

      {/* Venue List */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 shadow-sm divide-y divide-dashed divide-slate-200">
        {filteredVenues.map((venue) => (
          <button
            key={venue.id}
            onClick={() => router.push(`/venues/${venue.id}`)}
            className="w-full text-left px-5 py-4 hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="text-xs text-slate-500 mb-1">
                  {venue.area} | {venue.city} | {venue.state}
                </div>
                <h2 className="type-item-title text-base mb-0.5">
                  {venue.name}
                </h2>
                <div className="text-sm text-slate-500">
                  {venue.type} | {venue.capacity}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) =>
                    handleToggleFavorite(e, venue.id, venue.isFavorite)
                  }
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      venue.isFavorite
                        ? "fill-slate-900 text-slate-900"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No venues found matching your criteria
        </div>
      )}
    </main>
  );
}
