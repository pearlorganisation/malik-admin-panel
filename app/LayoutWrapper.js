"use client";

import { useSelector } from "react-redux";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {isAuthenticated && <Sidebar />}

      {/* Main Content */}
      <main
        className={`flex-1 bg-slate-100 p-6 ${
          isAuthenticated ? "lg:ml-64" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}