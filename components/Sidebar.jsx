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
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@/features/auth/authApi";
import { clearUser } from "@/features/auth/authSlice";
import { motion } from "framer-motion";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/activities", label: "Activity", icon: BarChart3 },
  { href: "/activities/create", label: "Create Activity", icon: BarChart3 },
  { href: "/admin/places", label: "Places", icon: MapPin },
  { href: "/admin/spots", label: "Spots", icon: Map },
  { href: "/admin/enquiry", label: "Enquiry", icon: HelpCircle },
  { href: "/admin/categories", label: "Categories", icon: HelpCircle },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
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
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-slate-900/80 backdrop-blur-lg text-white flex items-center justify-between p-4 z-40 border-b border-white/10">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <button onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-screen w-64 text-white z-50 flex flex-col transition-transform duration-300",
          "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10 backdrop-blur-xl",
          "shadow-2xl",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* animated glow */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>

        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
              <Settings className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold hidden lg:block">
              Admin Panel
            </h2>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      "group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-medium">{item.label}</span>

                    {/* glow effect */}
                    {!isActive && (
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition" />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10 space-y-4">

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

          <div className="text-center text-xs text-slate-400">
            © 2025 Admin Dashboard
          </div>

        </div>
      </aside>
    </>
  );
}