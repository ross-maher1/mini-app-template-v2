"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useGigs } from "@/contexts/GigContext";
import { StatusDropdown } from "@/components/gigs/StatusDropdown";
import type { GigStatus } from "@/lib/types";

const allStatuses: (GigStatus | "ALL GIGS")[] = [
  "ALL GIGS",
  "UPCOMING",
  "TBC",
  "CONFIRMED",
  "ANNOUNCED",
  "TO RECONCILE",
  "INVOICED",
  "RECONCILED",
  "CANCELLED",
];

export default function GigListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<GigStatus | "ALL GIGS">(
    "ALL GIGS"
  );

  const { gigs, updateGigStatus } = useGigs();

  const filteredGigs = useMemo(() => {
    return gigs.filter((gig) => {
      const matchesSearch =
        searchQuery === "" ||
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.act.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "ALL GIGS" || gig.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [gigs, searchQuery, selectedStatus]);

  const stats = useMemo(() => {
    const upcoming = gigs.filter((g) => g.status === "UPCOMING").length;
    const tbc = gigs.filter((g) => g.status === "TBC").length;
    const toReconcile = gigs.filter((g) => g.status === "TO RECONCILE").length;
    return { upcoming, tbc, toReconcile };
  }, [gigs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-purple-300">
      <div className="p-6 pb-28">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
              <span className="text-3xl font-bold text-white">G</span>
            </div>
            <h1 className="text-5xl font-bold text-white">Gigs</h1>
          </div>
          <div className="text-right text-white text-sm">
            <div>Upcoming | {stats.upcoming.toString().padStart(2, "0")}</div>
            <div>TBC | {stats.tbc.toString().padStart(2, "0")}</div>
            <div>
              To Reconcile | {stats.toReconcile.toString().padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or tag"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 backdrop-blur text-gray-900 placeholder:text-gray-500 placeholder:italic"
          />
        </div>

        {/* Status Filter */}
        <div className="flex justify-end mb-6">
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as GigStatus | "ALL GIGS")
            }
            className="px-6 py-2 rounded-full text-sm font-medium border-2 border-gray-800 bg-white text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors appearance-none pr-10 bg-no-repeat bg-right"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 1rem center",
            }}
          >
            {allStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Gig List */}
        <div className="space-y-0">
          {filteredGigs.map((gig, index) => (
            <div key={gig.id}>
              <button
                onClick={() => router.push(`/gigs/${gig.id}`)}
                className="w-full text-left py-4 hover:bg-white/20 transition-colors group"
              >
                <div className="flex justify-end mb-2">
                  <StatusDropdown
                    currentStatus={gig.status}
                    onStatusChange={(newStatus) =>
                      updateGigStatus(gig.id, newStatus)
                    }
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-700 mb-1">
                    {gig.date} | {gig.time}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1 italic">
                    {gig.title}
                  </h2>
                  <div className="text-sm text-gray-700">
                    {gig.act} | {gig.tour && `${gig.tour} | `}
                    {gig.venue} | {gig.city}
                  </div>
                </div>
              </button>
              {index < filteredGigs.length - 1 && (
                <div className="border-b border-dashed border-gray-400" />
              )}
            </div>
          ))}
        </div>

        {filteredGigs.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            No gigs found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
