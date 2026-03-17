"use client";

import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }) {

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const pathname = usePathname();

  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  // login page par sidebar hide
  const hideSidebar = pathname === "/login";

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      {isAdmin && !hideSidebar && <Sidebar />}

      {/* Main Content */}
      <main
        className={`flex-1 bg-slate-100 p-6 ${
          isAdmin && !hideSidebar ? "lg:ml-64" : ""
        }`}
      >
        {children}
      </main>

    </div>
  );
}