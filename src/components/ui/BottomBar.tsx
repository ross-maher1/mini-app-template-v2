"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music, MapPin, Users, Settings, Plus } from "lucide-react";

const navItems = [
  { href: "/", icon: Music, label: "Gigs" },
  { href: "/venues", icon: MapPin, label: "Venues" },
  { href: "/people", icon: Users, label: "People" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function BottomBar({ fabHref }: { fabHref?: string }) {
  const pathname = usePathname();

  const mid = Math.ceil(navItems.length / 2);
  const leftItems = fabHref ? navItems.slice(0, mid) : navItems;
  const rightItems = fabHref ? navItems.slice(mid) : [];

  const renderNav = (items: typeof navItems) =>
    items.map(({ href, icon: Icon, label }) => {
      const isActive =
        href === "/"
          ? pathname === "/" || pathname.startsWith("/gigs")
          : pathname.startsWith(href);
      return (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium transition-colors ${
            isActive
              ? "text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
          <span>{label}</span>
        </Link>
      );
    });

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-200/70 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {renderNav(leftItems)}

        {fabHref && (
          <Link
            href={fabHref}
            aria-label="Create new"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:bg-slate-800"
          >
            <Plus size={20} />
          </Link>
        )}

        {renderNav(rightItems)}
      </div>
    </nav>
  );
}
