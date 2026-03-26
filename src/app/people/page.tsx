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
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-purple-300 pb-28">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
              <span className="text-3xl font-bold text-white">G</span>
            </div>
            <h1 className="text-5xl font-bold text-white">People</h1>
          </div>
          <div className="text-right text-white text-sm">
            <div>Band | {stats.band.toString().padStart(2, "0")}</div>
            <div>Crew | {stats.crew.toString().padStart(2, "0")}</div>
            <div>Other | {stats.other.toString().padStart(2, "0")}</div>
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

        {/* People List */}
        <div className="space-y-0">
          {filteredPeople.map((person, index) => (
            <div key={person.id}>
              <button
                onClick={() => router.push(`/people/${person.id}`)}
                className="w-full text-left py-4 hover:bg-white/20 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1 italic">
                      {person.name}
                    </h2>
                    <div className="text-sm text-gray-700">
                      {person.role} | {person.type}
                    </div>
                  </div>
                  {person.phone && (
                    <div className="text-sm text-gray-700">{person.phone}</div>
                  )}
                </div>
              </button>
              {index < filteredPeople.length - 1 && (
                <div className="border-b border-dashed border-gray-400" />
              )}
            </div>
          ))}
        </div>

        {filteredPeople.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            No people found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
