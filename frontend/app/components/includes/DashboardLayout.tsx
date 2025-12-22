"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { Space_Grotesk } from "next/font/google";
import TopBar from "./TopBar";
import SubscriptionStatusBar from "../SubscriptionStatusBar";

const spacegrotesk = Space_Grotesk({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap",
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main
      className={`h-screen overflow-hidden bg-[var(--bg-soft)] ${spacegrotesk.className}`}
    >
      <SubscriptionStatusBar />
      <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 overflow-y-auto no-scroll-bar bg-[var(--bg-soft)]">
          {children}
        </div>
      </div>
    </main>
  );
}
