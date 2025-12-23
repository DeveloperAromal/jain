"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, LogOut } from "lucide-react";
import { Book, LayoutDashboard, Settings } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

export default function Sidebar({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth(); 

  const tabs = [
    {
      name: "Dashboard",
      url: "/learn/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Courses",
      url: "/learn/dashboard/courses",
      icon: <Book size={20} />,
    },
    {
      name: "Settings",
      url: "/learn/dashboard/settings",
      icon: <Settings size={20} />,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout(); 
      onClose?.();
      router.push("/"); 
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-72 bg-white border-r border-border
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-border md:hidden">
          <h2 className="text-lg font-semibold text-foreground">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-soft transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
          {tabs.map((item) => {
            const active = pathname === item.url;

            return (
              <Link
                key={item.url}
                href={item.url}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    active
                      ? "bg-accent-soft text-primary font-semibold shadow-sm"
                      : "text-text-secondary hover:bg-bg-soft hover:text-foreground"
                  }
                `}
              >
                <span
                  className={`transition-transform ${
                    active ? "scale-110" : "group-hover:scale-105"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="whitespace-nowrap text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3 px-4 py-5 rounded-xl
              text-sm font-medium text-red-600
              hover:bg-red-50 transition
            "
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
