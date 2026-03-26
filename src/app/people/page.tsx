"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { mockPeople } from "@/lib/data";

export default function PeoplePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPeople = useMemo(() => {
    return mockPeople.filter((person) => {
      return (
        searchQuery === "" ||
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  const stats = useMemo(() => {
    const band = mockPeople.filter((p) => p.type === "Band").length;
    const crew = mockPeople.filter((p) => p.type === "Crew").length;
    const other = mockPeople.filter((p) => p.type === "Other").length;
    return { band, crew, other };
  }, []);

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <p className="type-meta">Directory</p>
          <h1 className="type-h1">People</h1>
        </div>
        <div className="text-right text-sm text-slate-500 space-y-0.5">
          <div>Band | {stats.band.toString().padStart(2, "0")}</div>
          <div>Crew | {stats.crew.toString().padStart(2, "0")}</div>
          <div>Other | {stats.other.toString().padStart(2, "0")}</div>
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

      {/* People List */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 shadow-sm divide-y divide-dashed divide-slate-200">
        {filteredPeople.map((person) => (
          <button
            key={person.id}
            onClick={() => router.push(`/people/${person.id}`)}
            className="w-full text-left px-5 py-4 hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h2 className="type-item-title text-base mb-0.5">
                  {person.name}
                </h2>
                <div className="text-sm text-slate-500">
                  {person.role} | {person.type}
                </div>
              </div>
              {person.phone && (
                <div className="text-xs text-slate-400">{person.phone}</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No people found matching your criteria
        </div>
      )}
    </main>
  );
}
