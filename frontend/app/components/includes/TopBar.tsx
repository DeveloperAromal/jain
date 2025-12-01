"use client";

import { Bell, Menu, Search } from "lucide-react";
import Avatar from "./Avatar";

export default function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[var(--border)] bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
        <h2 className="font-semibold text-lg sm:text-xl md:text-2xl text-[var(--foreground)] truncate">
          Jain Math Hub
        </h2>
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-soft)] transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors" />
        </button>

        <div className="relative hidden md:flex items-center flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses, topics..."
            className="w-full pl-11 pr-4 py-2 sm:py-2.5 rounded-xl border border-[var(--border)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                       bg-[var(--bg-soft)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-secondary)]
                       transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 rounded-lg hover:bg-[var(--bg-soft)] transition-colors group">
          <Bell className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--foreground)] transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--primary)] rounded-full"></span>
        </button>
        <div className="h-6 w-px bg-[var(--border)] hidden sm:block"></div>
        <Avatar />
      </div>
    </header>
  );
}
