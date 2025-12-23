"use client";

import { useAuth } from "@/app/hooks/useAuth";
import Image from "next/image";
import { useState } from "react";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Avatar() {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();
  const { user, logout } = auth;
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-accent transition-colors group"
        aria-label="User menu"
      >
        <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary/50 transition-all">
          <Image
            src={"/avatar.png"}
            alt={user?.name || "avatar"}
            height={36}
            width={36}
            className="object-cover"
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-56 bg-white/90 backdrop-blur-3xl border border-border rounded-xl shadow-lg z-50 py-1">
          {/* User info section */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border">
                <Image
                  src={"/avatar.png"}
                  alt={user?.name || "avatar"}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <Link
              href="/learn/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">Profile & Settings</span>
            </Link>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
