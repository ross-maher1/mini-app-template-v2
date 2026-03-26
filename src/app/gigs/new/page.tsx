"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Link as LinkIcon,
  CheckCircle2,
  Circle,
  X,
  Info,
} from "lucide-react";
import { useVenues } from "@/contexts/VenueContext";
import { StatusDropdown } from "@/components/gigs/StatusDropdown";
import { DateTimePicker } from "@/components/gigs/DateTimePicker";
import { useState } from "react";
import type { GigStatus, PersonStatus } from "@/lib/types";
import { mockPeople, gigRoles } from "@/lib/data";

function formatDateTime(dateStr: string, timeStr: string): string {
  const date = new Date(dateStr);
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "pm" : "am";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const timeFormatted =
    minutes === "00" ? `${hour12}${ampm}` : `${hour12}:${minutes}${ampm}`;
  return `${dayOfWeek} ${month} ${day} | ${timeFormatted}`;
}

const musicianRoles = [
  "Lead Vocals",
  "Guitar",
  "Bass",
  "Drums",
  "Keyboards",
  "Saxophone",
  "Trumpet",
  "Trombone",
  "Violin",
  "Cello",
  "Percussion",
];

export default function CreateGigPage() {
  const router = useRouter();
  const { venues } = useVenues();

  const [title, setTitle] = useState("");
  const [act, setAct] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("20:00");
  const [status, setStatus] = useState<GigStatus>("TBC");
  const [description, setDescription] = useState("");
  const [people, setPeople] = useState<
    Array<{
      id: string;
      name: string;
      role: string;
      status: PersonStatus;
      fee: string;
    }>
  >([]);
  const [money, setMoney] = useState({
    gigFee: "",
    playerFees: "",
    supports: "",
    promo: "",
    rehearsal: "",
    production: "",
    travel: "",
    other: "",
    gst: "",
    superPayable: "",
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(
    null
  );
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [isVenueDropdownOpen, setIsVenueDropdownOpen] = useState(false);
  const [isSuperInfoOpen, setIsSuperInfoOpen] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<
    Record<string, (typeof mockPeople)[0]>
  >({});

  const isMusicianRole = (role: string): boolean =>
    musicianRoles.includes(role);

  const extractPlayerFeeValue = (playerFeesStr: string): string => {
    const match = playerFeesStr.match(/\d+/);
    return match ? match[0] : "";
  };

  const handleSave = () => {
    router.push("/");
  };

  const handleAddPerson = () => {
    setPeople([
      ...people,
      {
        id: `person-${Date.now()}-${Math.random()}`,
        name: "Name Surname",
        role: "Other",
        status: "TBC" as PersonStatus,
        fee: "",
      },
    ]);
  };

  const handleRemovePerson = (personId: string) => {
    setPeople(people.filter((p) => p.id !== personId));
  };

  const handleUpdatePersonRole = (personId: string, newRole: string) => {
    setPeople(
      people.map((p) => (p.id === personId ? { ...p, role: newRole } : p))
    );
  };

  const handleUpdatePersonStatus = (
    personId: string,
    newStatus: PersonStatus
  ) => {
    setPeople(
      people.map((p) =>
        p.id === personId ? { ...p, status: newStatus } : p
      )
    );
  };

  const handleUpdatePersonFee = (personId: string, fee: string) => {
    setPeople(people.map((p) => (p.id === personId ? { ...p, fee } : p)));
  };

  const handleAssignPerson = (
    personId: string,
    person: (typeof mockPeople)[0]
  ) => {
    setSelectedPeople((prev) => ({ ...prev, [personId]: person }));
    setPeople(
      people.map((p) =>
        p.id === personId ? { ...p, name: person.name } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-purple-300 pb-28">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/")}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors inline-flex items-center gap-2 text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Save Gig
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setIsDateTimePickerOpen(true)}
            className="text-sm text-gray-700 mb-2 hover:bg-white/20 rounded px-2 py-1 -mx-2 transition-colors"
          >
            {formatDateTime(date, time)}
          </button>
          <div className="flex justify-between items-start gap-4 mb-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Gig Title"
              className="text-4xl font-bold text-gray-900 bg-white/50 border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <StatusDropdown
              currentStatus={status}
              onStatusChange={(newStatus) => setStatus(newStatus)}
            />
          </div>
          <div className="text-sm text-gray-700 mb-4 flex items-center gap-1">
            <input
              type="text"
              value={act}
              onChange={(e) => setAct(e.target.value)}
              placeholder="Act name"
              className="bg-white/50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <span>/</span>
            <div className="relative">
              <button
                onClick={() => setIsVenueDropdownOpen(!isVenueDropdownOpen)}
                className="hover:bg-white/20 rounded px-2 py-1 transition-colors"
              >
                {venue || "Select venue"} {city && `/ ${city}`}
              </button>
              {isVenueDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-300 w-80 max-h-96 overflow-y-auto z-20">
                  {venues.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setVenue(v.name);
                        setCity(v.city);
                        setIsVenueDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0"
                    >
                      <div className="font-medium text-sm text-gray-900">
                        {v.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {v.area} | {v.city}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <LinkIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Gig description..."
            className="w-full text-sm text-gray-800 leading-relaxed bg-white/50 border border-gray-300 rounded px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* People Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 italic flex items-center gap-2">
            People
            <button
              onClick={() => setIsSuperInfoOpen(!isSuperInfoOpen)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Super payment information"
            >
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </h2>
          <div className="space-y-3">
            {[...people]
              .sort((a, b) => {
                const aIsMusician = isMusicianRole(a.role);
                const bIsMusician = isMusicianRole(b.role);
                if (aIsMusician && !bIsMusician) return -1;
                if (!aIsMusician && bIsMusician) return 1;
                return 0;
              })
              .map((person) => {
                const isMusician = isMusicianRole(person.role);
                const defaultFee = extractPlayerFeeValue(money.playerFees);
                const displayFee =
                  person.fee ||
                  (isMusician && defaultFee ? defaultFee : "");

                return (
                  <div key={person.id} className="relative">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenStatusDropdown(
                            openStatusDropdown === person.id
                              ? null
                              : person.id
                          );
                          setOpenDropdown(null);
                          setOpenRoleDropdown(null);
                        }}
                        className="flex-shrink-0 hover:opacity-70 transition-opacity"
                      >
                        {person.status === "Confirmed" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : person.status === "Declined" ? (
                          <X className="w-5 h-5 text-red-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      <div className="flex-1 text-sm text-gray-800 text-left flex items-center hover:bg-white/20 rounded px-2 py-1 -mx-2 transition-colors">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenRoleDropdown(
                              openRoleDropdown === person.id
                                ? null
                                : person.id
                            );
                            setOpenDropdown(null);
                            setOpenStatusDropdown(null);
                          }}
                          className="font-medium hover:opacity-70"
                        >
                          {person.role}
                        </button>
                        <span className="mx-1">|</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(
                              openDropdown === person.id ? null : person.id
                            );
                            setOpenRoleDropdown(null);
                            setOpenStatusDropdown(null);
                          }}
                          className="underline hover:opacity-70"
                        >
                          {selectedPeople[person.id]?.name || person.name}
                        </button>
                      </div>

                      <input
                        type="text"
                        value={displayFee}
                        onChange={(e) =>
                          handleUpdatePersonFee(person.id, e.target.value)
                        }
                        placeholder={isMusician ? defaultFee : ""}
                        className="w-20 bg-white/50 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* Status Dropdown */}
                    {openStatusDropdown === person.id && (
                      <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-300 w-40 z-10">
                        {(
                          ["TBC", "Confirmed", "Declined"] as PersonStatus[]
                        ).map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              handleUpdatePersonStatus(person.id, s);
                              setOpenStatusDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors border-b border-gray-200 text-sm"
                          >
                            {s}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            handleRemovePerson(person.id);
                            setOpenStatusDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-red-100 transition-colors text-sm text-red-600 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Role Dropdown */}
                    {openRoleDropdown === person.id && (
                      <div className="absolute left-8 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-300 w-48 max-h-64 overflow-y-auto z-10">
                        {gigRoles.map((role, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              handleUpdatePersonRole(person.id, role);
                              setOpenRoleDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 text-sm"
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Person Name Dropdown */}
                    {openDropdown === person.id && (
                      <div className="absolute left-8 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-300 w-64 max-h-64 overflow-y-auto z-10">
                        {mockPeople.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setOpenDropdown(null);
                              handleAssignPerson(person.id, p);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0"
                          >
                            <div className="font-medium text-sm text-gray-900">
                              {p.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {p.role} | {p.type}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            <button
              onClick={handleAddPerson}
              className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-400 text-gray-600 hover:bg-white/20 transition-colors"
            >
              +
            </button>
          </div>
        </section>

        {/* Money Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 italic">$$$</h2>
          <div className="space-y-2 text-sm text-gray-800">
            {(
              [
                ["Gig Fee", "gigFee"],
                ["Player fees", "playerFees"],
                ["Supports", "supports"],
                ["Promo", "promo"],
                ["Rehearsal", "rehearsal"],
                ["Production", "production"],
                ["Travel", "travel"],
                ["Other", "other"],
              ] as const
            ).map(([label, field]) => (
              <div key={field} className="flex items-center gap-2">
                <span className="w-40">{label} -</span>
                <input
                  type="text"
                  value={money[field]}
                  onChange={(e) =>
                    setMoney({ ...money, [field]: e.target.value })
                  }
                  className="flex-1 bg-white/50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            ))}
            <div className="border-b border-dashed border-gray-400 my-3" />
            {(
              [
                ["GST", "gst"],
                ["Super payable (est.)", "superPayable"],
              ] as const
            ).map(([label, field]) => (
              <div key={field} className="flex items-center gap-2">
                <span className="w-40">{label} -</span>
                <input
                  type="text"
                  value={money[field]}
                  onChange={(e) =>
                    setMoney({ ...money, [field]: e.target.value })
                  }
                  className="flex-1 bg-white/50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            ))}
            <div className="font-medium">
              Profit / Loss -{" "}
              {(() => {
                const parseValue = (val: string) => {
                  const num = parseFloat(val.replace(/[^0-9.-]/g, ""));
                  return isNaN(num) ? 0 : num;
                };
                const gigFee = parseValue(money.gigFee);
                const costs =
                  parseValue(money.playerFees) +
                  parseValue(money.supports) +
                  parseValue(money.promo) +
                  parseValue(money.rehearsal) +
                  parseValue(money.production) +
                  parseValue(money.travel) +
                  parseValue(money.other) +
                  parseValue(money.gst) +
                  parseValue(money.superPayable);
                const profitLoss = gigFee - costs;
                return profitLoss >= 0
                  ? `$${profitLoss.toFixed(2)}`
                  : `-$${Math.abs(profitLoss).toFixed(2)}`;
              })()}
            </div>
          </div>
        </section>

        {/* Docs Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 italic">
            Docs
          </h2>
          <div className="text-sm text-gray-600 italic">No documents yet</div>
        </section>

        {/* Links Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 italic">
            Links
          </h2>
          <div className="text-sm text-gray-600 italic">No links yet</div>
        </section>
      </div>

      {/* Date Time Picker Modal */}
      <DateTimePicker
        isOpen={isDateTimePickerOpen}
        onClose={() => setIsDateTimePickerOpen(false)}
        currentDate={date}
        currentTime={time}
        onSave={(newDate, newTime) => {
          setDate(newDate);
          setTime(newTime);
        }}
      />

      {/* Super Info Popup */}
      {isSuperInfoOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-orange-200/60 via-pink-200/60 to-purple-300/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-8 relative border border-white/40">
            <button
              onClick={() => setIsSuperInfoOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 pr-8">
              Superannuation Payment Guide
            </h3>
            <div className="text-sm text-gray-700 space-y-5">
              <p className="leading-relaxed">
                If you&apos;re organising a gig, you are responsible for super
                for most people you pay.
              </p>
              <ul className="space-y-3 ml-1">
                <li className="flex gap-3">
                  <span className="text-purple-500 font-bold">&bull;</span>
                  <div>
                    <strong className="text-gray-900">Band leaders:</strong> Pay
                    super if you&apos;re paying an individual. If you pay a
                    company, usually no.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-500 font-bold">&bull;</span>
                  <div>
                    <strong className="text-gray-900">
                      Musicians & performers:
                    </strong>{" "}
                    Super applies, even if they invoice you.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-500 font-bold">&bull;</span>
                  <div>
                    <strong className="text-gray-900">Tech crew:</strong> Super
                    applies.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-500 font-bold">&bull;</span>
                  <div>
                    <strong className="text-gray-900">Venues:</strong> If they
                    pay staff, they handle super. If you hire directly, you do.
                  </div>
                </li>
              </ul>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 italic">
                  This is general guidance only. Always check with an accountant
                  for your specific situation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
