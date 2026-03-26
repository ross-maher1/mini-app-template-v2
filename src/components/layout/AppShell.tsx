import { ReactNode } from "react";
import BottomBar from "../ui/BottomBar";

/**
 * Main layout wrapper that provides:
 * - Content container
 * - Bottom navigation bar with FAB for creating new gigs
 */
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-content">{children}</div>
      <BottomBar fabHref="/gigs/new" />
    </div>
  );
}
