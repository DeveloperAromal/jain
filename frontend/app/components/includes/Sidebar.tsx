"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, LogOut, Book, LayoutDashboard, Settings } from "lucide-react";
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
  const { logout, user } = useAuth();

  const tabs = [
    {
      name: "Dashboard",
      url: "/learn/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Courses",
      url: "/learn/dashboard/courses",
      icon: <Book size={18} />,
    },
    ...(user?.class === "12"
      ? [
          {
            name: "Improvement Classes",
            url: "/learn/dashboard/improvement",
            icon: <Book size={18} />,
          },
        ]
      : []),
    {
      name: "Settings",
      url: "/learn/dashboard/settings",
      icon: <Settings size={18} />,
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
          w-60 bg-white border-r border-border
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border md:hidden">
          <h2 className="text-sm font-semibold text-foreground">Menu</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-accent transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>


        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-2 py-3 overflow-y-auto text-sm">
          {tabs.map((item) => {
            const active = pathname === item.url;

            return (
              <Link
                key={item.url}
                href={item.url}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-xl
                  transition-colors
                  ${
                    active
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }
                `}
              >
                <span className="flex items-center justify-center w-8">
                  {item.icon}
                </span>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-2 pb-3 pt-1 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="flex items-center justify-center w-8">
              <LogOut size={18} />
            </span>
            <span className="truncate">Logout</span>
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
