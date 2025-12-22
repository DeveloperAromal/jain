"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Book, LayoutDashboard, Settings, FileText, Users, LineChart } from "lucide-react";

export default function Sidebar({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

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
    // {
    //   name: "Assignments",
    //   url: "/learn/dashboard/assignments",
    //   icon: <FileText size={20} />,
    // },
    // {
    //   name: "Progress",
    //   url: "/learn/dashboard/progress",
    //   icon: <LineChart size={20} />,
    // },
    // {
    //   name: "Community",
    //   url: "/learn/dashboard/community",
    //   icon: <Users size={20} />,
    // },
    {
      name: "Settings",
      url: "/learn/dashboard/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <>
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 bg-white border-r border-[var(--border)] 
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] md:hidden">
          <h2 className="text-lg font-semibold text-foreground">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-soft)] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4 overflow-y-auto">
          {tabs.map((item) => {
            const active = pathname === item.url;

            return (
              <Link
                key={item.url}
                href={item.url}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-200
                  ${active
                    ? "bg-[var(--accent-soft)] text-[var(--primary)] font-semibold shadow-sm"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] hover:text-[var(--foreground)]"
                  }
                `}
              >
                <span className={`transition-transform ${active ? "scale-110" : "group-hover:scale-105"}`}>
                  {item.icon}
                </span>
                <span className="whitespace-nowrap text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
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
