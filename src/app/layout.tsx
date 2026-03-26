import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import AppShell from "@/components/layout/AppShell";
import { AuthProvider } from "@/contexts/AuthContext";
import { GigProvider } from "@/contexts/GigContext";
import { VenueProvider } from "@/contexts/VenueContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gig Management",
  description: "Manage your gigs, venues, and people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <GigProvider>
            <VenueProvider>
              <ToastProvider />
              <AppShell>{children}</AppShell>
            </VenueProvider>
          </GigProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
