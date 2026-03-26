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
    <main className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          Save Gig
        </button>
      </div>

      {/* Title & Meta Card */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setIsDateTimePickerOpen(true)}
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            {formatDateTime(date, time)}
          </button>
          <StatusDropdown
            currentStatus={status}
            onStatusChange={(newStatus) => setStatus(newStatus)}
          />
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Gig Title"
          className="w-full text-2xl font-semibold tracking-tight text-slate-900 bg-transparent border-b border-slate-200 pb-2 focus:outline-none focus:border-slate-400 placeholder:text-slate-300"
        />

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <input
            type="text"
            value={act}
            onChange={(e) => setAct(e.target.value)}
            placeholder="Act name"
            className="bg-transparent border-b border-slate-200 px-1 py-0.5 focus:outline-none focus:border-slate-400 placeholder:text-slate-300"
          />
          <span>/</span>
          <div className="relative">
            <button
              onClick={() => setIsVenueDropdownOpen(!isVenueDropdownOpen)}
              className="hover:text-slate-700 transition-colors"
            >
              {venue || "Select venue"} {city && `/ ${city}`}
            </button>
            {isVenueDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 rounded-xl border border-slate-200 bg-white shadow-lg w-72 max-h-80 overflow-y-auto z-20">
                {venues.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setVenue(v.name);
                      setCity(v.city);
                      setIsVenueDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                  >
                    <div className="text-sm font-medium text-slate-900">
                      {v.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {v.area} | {v.city}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="ml-auto p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <LinkIcon className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Gig description..."
          className="w-full text-sm text-slate-600 leading-relaxed bg-transparent border border-slate-200 rounded-xl px-3 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-300"
        />
      </div>

      {/* People Section */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
        <h2 className="type-item-title text-base mb-4 flex items-center gap-2">
          People
          <button
            onClick={() => setIsSuperInfoOpen(!isSuperInfoOpen)}
            className="p-0.5 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Super payment information"
          >
            <Info className="w-4 h-4 text-slate-400" />
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
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : person.status === "Declined" ? (
                        <X className="w-4 h-4 text-red-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 text-sm text-slate-700 flex items-center">
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
                        className="font-medium hover:text-slate-900"
                      >
                        {person.role}
                      </button>
                      <span className="mx-1.5 text-slate-300">|</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(
                            openDropdown === person.id ? null : person.id
                          );
                          setOpenRoleDropdown(null);
                          setOpenStatusDropdown(null);
                        }}
                        className="underline hover:text-slate-900"
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
                      className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>

                  {/* Status Dropdown */}
                  {openStatusDropdown === person.id && (
                    <div className="absolute left-0 top-full mt-1 rounded-xl border border-slate-200 bg-white shadow-lg w-40 z-10">
                      {(
                        ["TBC", "Confirmed", "Declined"] as PersonStatus[]
                      ).map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            handleUpdatePersonStatus(person.id, s);
                            setOpenStatusDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors border-b border-slate-100 text-sm"
                        >
                          {s}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          handleRemovePerson(person.id);
                          setOpenStatusDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors text-sm text-red-600 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Role Dropdown */}
                  {openRoleDropdown === person.id && (
                    <div className="absolute left-8 top-full mt-1 rounded-xl border border-slate-200 bg-white shadow-lg w-48 max-h-64 overflow-y-auto z-10">
                      {gigRoles.map((role, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleUpdatePersonRole(person.id, role);
                            setOpenRoleDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 text-sm"
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Person Name Dropdown */}
                  {openDropdown === person.id && (
                    <div className="absolute left-8 top-full mt-1 rounded-xl border border-slate-200 bg-white shadow-lg w-64 max-h-64 overflow-y-auto z-10">
                      {mockPeople.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setOpenDropdown(null);
                            handleAssignPerson(person.id, p);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                        >
                          <div className="text-sm font-medium text-slate-900">
                            {p.name}
                          </div>
                          <div className="text-xs text-slate-500">
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
            className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-slate-300 text-slate-500 hover:bg-slate-50 transition-colors text-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Money Section */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
        <h2 className="type-item-title text-base mb-4">$$$</h2>
        <div className="space-y-2 text-sm text-slate-700">
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
              <span className="w-36 text-slate-500">{label} -</span>
              <input
                type="text"
                value={money[field]}
                onChange={(e) =>
                  setMoney({ ...money, [field]: e.target.value })
                }
                className="flex-1 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          ))}
          <div className="border-b border-dashed border-slate-200 my-3" />
          {(
            [
              ["GST", "gst"],
              ["Super payable (est.)", "superPayable"],
            ] as const
          ).map(([label, field]) => (
            <div key={field} className="flex items-center gap-2">
              <span className="w-36 text-slate-500">{label} -</span>
              <input
                type="text"
                value={money[field]}
                onChange={(e) =>
                  setMoney({ ...money, [field]: e.target.value })
                }
                className="flex-1 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          ))}
          <div className="font-medium text-slate-900">
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
      </div>

      {/* Docs Section */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
        <h2 className="type-item-title text-base mb-3">Docs</h2>
        <div className="text-sm text-slate-400 italic">No documents yet</div>
      </div>

      {/* Links Section */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
        <h2 className="type-item-title text-base mb-3">Links</h2>
        <div className="text-sm text-slate-400 italic">No links yet</div>
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
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 relative border border-slate-200">
            <button
              onClick={() => setIsSuperInfoOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="type-item-title text-base mb-4 pr-8">
              Superannuation Payment Guide
            </h3>
            <div className="text-sm text-slate-600 space-y-4">
              <p className="leading-relaxed">
                If you&apos;re organising a gig, you are responsible for super
                for most people you pay.
              </p>
              <ul className="space-y-2.5 ml-1">
                <li className="flex gap-2">
                  <span className="text-slate-400">&bull;</span>
                  <div>
                    <strong className="text-slate-900">Band leaders:</strong> Pay
                    super if you&apos;re paying an individual. If you pay a
                    company, usually no.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-400">&bull;</span>
                  <div>
                    <strong className="text-slate-900">
                      Musicians & performers:
                    </strong>{" "}
                    Super applies, even if they invoice you.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-400">&bull;</span>
                  <div>
                    <strong className="text-slate-900">Tech crew:</strong> Super
                    applies.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-400">&bull;</span>
                  <div>
                    <strong className="text-slate-900">Venues:</strong> If they
                    pay staff, they handle super. If you hire directly, you do.
                  </div>
                </li>
              </ul>
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-400 italic">
                  This is general guidance only. Always check with an accountant
                  for your specific situation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
