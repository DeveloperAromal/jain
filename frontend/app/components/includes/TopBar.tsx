"use client";

import { Menu } from "lucide-react";
import Avatar from "./Avatar";

export default function TopBar({ onMenuClick } : { onMenuClick? : () => void }) {
  return (
    <header className="sticky top-0 z-20 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-5 border-b border-border bg-white/95 backdrop-blur">
      {/* Left: menu + brand (like YouTube logo + text) */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded bg-primary" />
          <h2 className="font-semibold text-base sm:text-lg md:text-xl text-foreground truncate">
            Jain Math Hub
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:block h-6 w-px bg-border" />
        <Avatar />
      </div>
    </header>
  );
}
