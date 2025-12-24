"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/activities", label: "Activity", icon: BarChart3 },
    { href: "/admin/activities/create", label: "Create Activity", icon: BarChart3 },
  { href: "/admin/bookings", label: "Bookings", icon: Package },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/logout", label: "Logout", icon: LogOut },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "h-screen bg-slate-900 text-slate-100 transition-all duration-300 fixed left-0 top-0 z-50 flex flex-col",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800">
        <div
          className={clsx(
            "flex items-center gap-3",
            !isOpen && "justify-center"
          )}
        >
          <div className="p-2 bg-blue-600 rounded-lg">
            <Settings className="w-6 h-6" />
          </div>
          {isOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
        </div>

        {/* Toggle Button - visible on all screens */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 lg:hidden"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-800 text-slate-300"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer (optional) */}
      {isOpen && (
        <div className="p-5 border-t border-slate-800 text-center text-sm text-slate-400">
          © 2025 Admin Dashboard
        </div>
      )}
    </aside>
  );
}
