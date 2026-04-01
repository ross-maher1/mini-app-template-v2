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
    <main className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <p className="type-meta">Dashboard</p>
          <h1 className="type-h1">Gigs</h1>
        </div>
        <div className="text-right text-sm text-slate-500 space-y-0.5">
          <div>Upcoming | {stats.upcoming.toString().padStart(2, "0")}</div>
          <div>TBC | {stats.tbc.toString().padStart(2, "0")}</div>
          <div>To Reconcile | {stats.toReconcile.toString().padStart(2, "0")}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
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
        <div className="flex justify-end">
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as GigStatus | "ALL GIGS")
            }
            className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white/85 text-slate-900 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            {allStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gig List */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 shadow-sm divide-y divide-dashed divide-slate-200">
        {filteredGigs.map((gig) => (
          <button
            key={gig.id}
            onClick={() => router.push(`/gigs/${gig.id}`)}
            className="w-full text-left px-5 py-4 hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex justify-end mb-1.5">
              <StatusDropdown
                currentStatus={gig.status}
                onStatusChange={(newStatus) =>
                  updateGigStatus(gig.id, newStatus)
                }
              />
            </div>
            <div className="text-xs text-slate-500 mb-1">
              {gig.date} | {gig.time}
            </div>
            <h2 className="type-item-title text-base mb-0.5">
              {gig.title}
            </h2>
            <div className="text-sm text-slate-500">
              {gig.act} | {gig.tour && `${gig.tour} | `}
              {gig.venue} | {gig.city}
            </div>
          </button>
        ))}
      </div>

      {filteredGigs.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No gigs found matching your criteria
        </div>
      )}
    </main>
  );
}
