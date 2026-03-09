"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Package,
  Settings,
  MapPin,
  Map,
  HelpCircle,
  LogOut,
  X,
  Menu, // ✅ ADDED
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@/features/auth/authApi";
import { clearUser } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/activities", label: "Activity", icon: BarChart3 },
  { href: "/activities/create", label: "Create Activity", icon: BarChart3 },
  // { href: "/admin/bookings", label: "Bookings", icon: Package },
  { href: "/admin/places", label: "Places", icon: MapPin },
  { href: "/admin/spots", label: "Spots", icon: Map },
  { href: "/admin/enquiry", label: "Enquiry", icon: HelpCircle },
  { href: "/admin/categories", label: "Categories", icon: HelpCircle },
  // { href: "/admin/settings", label: "Settings", icon: Settings },
  // { href: "/logout", label: "Logout", icon: LogOut },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // ✅ mobile closed by default
  const pathname = usePathname();

  const { isAuthenticated } = useSelector((state) => state.auth);
const dispatch = useDispatch();
const router = useRouter();
const [logoutUser] = useLogoutMutation();

const handleLogout = async () => {
  try {
    await logoutUser().unwrap();
    dispatch(clearUser());
    router.push("/login");
  } catch (error) {
    console.error("Logout error", error);
  }
};

if (!isAuthenticated) return null;

  return (
    <>
      {/* ✅ MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-slate-900 text-white flex items-center justify-between p-4 z-40">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <button onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* ✅ OVERLAY (Mobile Only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
     <aside
  className={clsx(
    "fixed top-0 left-0 h-screen bg-slate-900 text-slate-100 transition-all duration-300 z-50 flex flex-col",
    // Desktop always visible
    "lg:translate-x-0 lg:w-64",
    // Mobile animation
    isOpen ? "translate-x-0 w-64" : "-translate-x-full"
  )}
>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b  border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Settings className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold hidden lg:block">
              Admin Panel
            </h2>
          </div>

          {/* Close Button (Mobile) */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide py-3 ">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)} // ✅ close after click (mobile)
                    className={clsx(
                      "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-800 text-slate-300"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">

  <button
    onClick={handleLogout}
    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 transition"
  >
    <LogOut className="w-5 h-5" />
    Logout
  </button>

  <div className="text-center text-xs text-slate-500">
    © 2025 Admin Dashboard
  </div>

</div>
      </aside>
    </>
  );
}
