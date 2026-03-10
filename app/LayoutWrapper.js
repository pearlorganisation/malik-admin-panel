"use client";

import { useSelector } from "react-redux";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {isAdmin && <Sidebar />}

      {/* Main Content */}
      <main
        className={`flex-1 bg-slate-100 p-6 ${
          isAdmin ? "lg:ml-64" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}