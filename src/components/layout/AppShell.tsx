import { ReactNode } from "react";
import BottomBar from "../ui/BottomBar";

/**
 * Main layout wrapper that provides:
 * - Decorative background blob
 * - Content container
 * - Bottom navigation bar with FAB for creating new gigs
 */
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-blob" aria-hidden="true" />
      <div className="app-content">{children}</div>
      <BottomBar fabHref="/gigs/new" />
    </div>
  );
}
