"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Link as LinkIcon,
  CheckCircle2,
  Circle,
  X,
  Info,
} from "lucide-react";
import { useGigs } from "@/contexts/GigContext";
import { useVenues } from "@/contexts/VenueContext";
import { StatusDropdown } from "@/components/gigs/StatusDropdown";
import { DateTimePicker } from "@/components/gigs/DateTimePicker";
import { useState } from "react";
import type { PersonStatus } from "@/lib/types";
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
  "Lead Vocals", "Guitar", "Bass", "Drums", "Keyboards",
  "Saxophone", "Trumpet", "Trombone", "Violin", "Cello", "Percussion",
];

export default function GigDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null);
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [isVenueDropdownOpen, setIsVenueDropdownOpen] = useState(false);
  const [isSuperInfoOpen, setIsSuperInfoOpen] = useState(false);

  const {
    gigs, updateGigStatus, updateGigDateTime, updateGigVenue,
    updateGigMoney, updateGigPersonRole, updateGigPersonStatus,
    updateGigPersonFee, removePersonFromGig, addPersonToGig,
    assignPersonToGig, personAssignments,
  } = useGigs();
  const { venues } = useVenues();
  const gig = gigs.find((g) => g.id === id);

  const isMusicianRole = (role: string): boolean => musicianRoles.includes(role);
  const extractPlayerFeeValue = (s: string): string => {
    const m = s.match(/\d+/);
    return m ? m[0] : "";
  };

  if (!gig) {
    return (
      <main className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-xl text-slate-700">Gig not found</h2>
          <button onClick={() => router.push("/")} className="mt-4 text-sm text-slate-500 hover:text-slate-900">
            Back to list
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm space-y-3">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <button
              onClick={() => setIsDateTimePickerOpen(true)}
              className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
            >
              {formatDateTime(gig.date, gig.time)}
            </button>
            <h1 className="type-h1">{gig.title}</h1>
          </div>
          <StatusDropdown currentStatus={gig.status} onStatusChange={(s) => updateGigStatus(gig.id, s)} />
        </div>
        <div className="text-sm text-slate-500 flex items-center gap-1">
          <span>{gig.act}</span>
          <span>/</span>
          <div className="relative">
            <button onClick={() => setIsVenueDropdownOpen(!isVenueDropdownOpen)} className="hover:text-slate-900 transition-colors">
              {gig.venue} / {gig.city}
            </button>
            {isVenueDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 w-72 max-h-80 overflow-y-auto z-20">
                {venues.map((venue) => (
                  <button key={venue.id} onClick={() => { updateGigVenue(gig.id, venue.name, venue.city); setIsVenueDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0">
                    <div className="font-medium text-sm text-slate-900">{venue.name}</div>
                    <div className="text-xs text-slate-500">{venue.area} | {venue.city}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="ml-2 hover:text-slate-900 transition-colors"><LinkIcon className="w-4 h-4" /></button>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{gig.description}</p>
      </div>

      {/* People */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          People
          <button onClick={() => setIsSuperInfoOpen(!isSuperInfoOpen)} className="text-slate-400 hover:text-slate-600" aria-label="Super payment information">
            <Info className="w-4 h-4" />
          </button>
        </h2>
        <div className="space-y-2.5">
          {[...gig.people]
            .sort((a, b) => {
              const aM = isMusicianRole(a.role), bM = isMusicianRole(b.role);
              return aM === bM ? 0 : aM ? -1 : 1;
            })
            .map((person) => {
              const isMusician = isMusicianRole(person.role);
              const defaultFee = extractPlayerFeeValue(gig.money.playerFees);
              const displayFee = person.fee || (isMusician && defaultFee ? defaultFee : "");
              return (
                <div key={person.id} className="relative flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); setOpenStatusDropdown(openStatusDropdown === person.id ? null : person.id); setOpenDropdown(null); setOpenRoleDropdown(null); }}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity">
                    {person.status === "Confirmed" ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                     person.status === "Declined" ? <X className="w-5 h-5 text-rose-500" /> :
                     <Circle className="w-5 h-5 text-slate-300" />}
                  </button>
                  <div className="flex-1 text-sm text-slate-700 flex items-center">
                    <button onClick={(e) => { e.stopPropagation(); setOpenRoleDropdown(openRoleDropdown === person.id ? null : person.id); setOpenDropdown(null); setOpenStatusDropdown(null); }}
                      className="font-medium hover:text-slate-900">{person.role}</button>
                    <span className="mx-1.5 text-slate-300">|</span>
                    <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === person.id ? null : person.id); setOpenRoleDropdown(null); setOpenStatusDropdown(null); }}
                      className="underline hover:text-slate-900">{personAssignments[gig.id]?.[person.id]?.personName || person.name}</button>
                  </div>
                  <input type="text" value={displayFee} onChange={(e) => updateGigPersonFee(gig.id, person.id, e.target.value)}
                    placeholder={isMusician ? defaultFee : ""}
                    className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-300" />

                  {openStatusDropdown === person.id && (
                    <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 w-36 z-10">
                      {(["TBC", "Confirmed", "Declined"] as PersonStatus[]).map((s) => (
                        <button key={s} onClick={() => { updateGigPersonStatus(gig.id, person.id, s); setOpenStatusDropdown(null); }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm border-b border-slate-100">{s}</button>
                      ))}
                      <button onClick={() => { removePersonFromGig(gig.id, person.id); setOpenStatusDropdown(null); }}
                        className="w-full text-left px-3 py-2 hover:bg-rose-50 text-sm text-rose-600 font-medium">Remove</button>
                    </div>
                  )}
                  {openRoleDropdown === person.id && (
                    <div className="absolute left-8 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 w-44 max-h-56 overflow-y-auto z-10">
                      {gigRoles.map((role, i) => (
                        <button key={i} onClick={() => { updateGigPersonRole(gig.id, person.id, role); setOpenRoleDropdown(null); }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm border-b border-slate-100 last:border-b-0">{role}</button>
                      ))}
                    </div>
                  )}
                  {openDropdown === person.id && (
                    <div className="absolute left-8 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 w-56 max-h-56 overflow-y-auto z-10">
                      {mockPeople.map((p) => (
                        <button key={p.id} onClick={() => { setOpenDropdown(null); assignPersonToGig(gig.id, person.id, { personId: p.id, personName: p.name, personRole: p.role }); }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-b-0">
                          <div className="font-medium text-sm text-slate-900">{p.name}</div>
                          <div className="text-xs text-slate-500">{p.role} | {p.type}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          <button onClick={() => addPersonToGig(gig.id)}
            className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors text-sm">+</button>
        </div>
      </div>

      {/* Money */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">$$$</h2>
        <div className="space-y-2 text-sm">
          {([["Gig Fee","gigFee"],["Player fees","playerFees"],["Supports","supports"],["Promo","promo"],["Rehearsal","rehearsal"],["Production","production"],["Travel","travel"],["Other","other"]] as const).map(([label, field]) => (
            <div key={field} className="flex items-center gap-2">
              <span className="w-36 text-slate-500">{label}</span>
              <input type="text" value={gig.money[field]} onChange={(e) => updateGigMoney(gig.id, field, e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg px-2 py-1 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
            </div>
          ))}
          <div className="border-b border-dashed border-slate-200 my-2" />
          {([["GST","gst"],["Super payable (est.)","superPayable"]] as const).map(([label, field]) => (
            <div key={field} className="flex items-center gap-2">
              <span className="w-36 text-slate-500">{label}</span>
              <input type="text" value={gig.money[field]} onChange={(e) => updateGigMoney(gig.id, field, e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg px-2 py-1 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
            </div>
          ))}
          <div className="font-medium text-slate-900">
            Profit / Loss —{" "}
            {(() => {
              const pv = (v: string) => { const n = parseFloat(v.replace(/[^0-9.-]/g, "")); return isNaN(n) ? 0 : n; };
              const fee = pv(gig.money.gigFee);
              const costs = pv(gig.money.playerFees)+pv(gig.money.supports)+pv(gig.money.promo)+pv(gig.money.rehearsal)+pv(gig.money.production)+pv(gig.money.travel)+pv(gig.money.other)+pv(gig.money.gst)+pv(gig.money.superPayable);
              const pl = fee - costs;
              return pl >= 0 ? `$${pl.toFixed(2)}` : `-$${Math.abs(pl).toFixed(2)}`;
            })()}
          </div>
        </div>
      </div>

      {/* Docs */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Docs</h2>
        <div className="space-y-2">
          {gig.docs.length > 0 ? gig.docs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-2.5">
              {doc.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> :
               doc.type === "Worksheet" ? <Circle className="w-4 h-4 text-rose-400 flex-shrink-0" /> :
               <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />}
              <span className="text-sm text-slate-700">{doc.name}</span>
            </div>
          )) : <p className="text-sm text-slate-400 italic">No documents yet</p>}
        </div>
      </div>

      {/* Links */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Links</h2>
        <div className="space-y-2">
          {gig.links.length > 0 ? gig.links.map((link) => (
            <div key={link.id} className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <a href={link.url} className="text-sm text-slate-700 underline hover:no-underline" target="_blank" rel="noopener noreferrer">{link.name}</a>
            </div>
          )) : <p className="text-sm text-slate-400 italic">No links yet</p>}
        </div>
      </div>

      {/* Date Time Picker Modal */}
      <DateTimePicker isOpen={isDateTimePickerOpen} onClose={() => setIsDateTimePickerOpen(false)}
        currentDate={gig.date} currentTime={gig.time} onSave={(d, t) => updateGigDateTime(gig.id, d, t)} />

      {/* Super Info Popup */}
      {isSuperInfoOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative border border-slate-200">
            <button onClick={() => setIsSuperInfoOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pr-8">Superannuation Payment Guide</h3>
            <div className="text-sm text-slate-600 space-y-4">
              <p>If you&apos;re organising a gig, you are responsible for super for most people you pay.</p>
              <ul className="space-y-2 ml-1">
                {[
                  ["Band leaders:", "Pay super if you're paying an individual. If you pay a company, usually no."],
                  ["Musicians & performers:", "Super applies, even if they invoice you."],
                  ["Tech crew:", "Super applies."],
                  ["Venues:", "If they pay staff, they handle super. If you hire directly, you do."],
                ].map(([title, desc], i) => (
                  <li key={i} className="flex gap-2"><span className="text-slate-400">•</span><div><strong className="text-slate-900">{title}</strong> {desc}</div></li>
                ))}
              </ul>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="font-medium text-slate-900 mb-1">Rate: 12% on top of pay (since 1 July 2025).</p>
                <p className="text-slate-600">Rule: Paying individuals for their labour = you pay super.</p>
              </div>
            </div>
            <button onClick={() => setIsSuperInfoOpen(false)}
              className="mt-5 w-full bg-slate-900 text-white py-2.5 px-4 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm">
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
