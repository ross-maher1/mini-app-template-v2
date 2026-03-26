"use client";

import type { GigStatus } from "@/lib/types";

const statusColors: Record<GigStatus, string> = {
  UPCOMING: "bg-gray-200 text-gray-800 border-gray-300",
  TBC: "bg-orange-400 text-gray-900 border-orange-500",
  CONFIRMED: "bg-green-400 text-gray-900 border-green-500",
  ANNOUNCED: "bg-lime-400 text-gray-900 border-lime-500",
  "TO RECONCILE": "bg-sky-400 text-gray-900 border-sky-500",
  INVOICED: "bg-pink-300 text-gray-900 border-pink-400",
  RECONCILED: "bg-sky-300 text-gray-900 border-sky-400",
  CANCELLED: "bg-gray-300 text-gray-700 border-gray-400",
};

const statuses: GigStatus[] = [
  "UPCOMING",
  "TBC",
  "CONFIRMED",
  "ANNOUNCED",
  "TO RECONCILE",
  "INVOICED",
  "RECONCILED",
  "CANCELLED",
];

interface StatusDropdownProps {
  currentStatus: GigStatus;
  onStatusChange: (newStatus: GigStatus) => void;
}

export function StatusDropdown({
  currentStatus,
  onStatusChange,
}: StatusDropdownProps) {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value as GigStatus)}
      onClick={(e) => e.stopPropagation()}
      className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap cursor-pointer ${statusColors[currentStatus]} hover:opacity-80 transition-opacity appearance-none pr-6 bg-no-repeat bg-right`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='currentColor' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
        backgroundPosition: "right 0.5rem center",
      }}
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
