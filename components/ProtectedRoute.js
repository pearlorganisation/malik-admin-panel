"use client";

import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {

    // ✅ If logged in → block login page
    if (pathname === "/login" && isAuthenticated) {
      router.replace("/");
      return;
    }

    // ✅ Allow login page
    if (pathname === "/login") return;

    // ❌ Not logged in → redirect
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // ❌ Not admin → block
    if (user?.role !== "ADMIN") {
      toast.error("Unauthorized");
      router.replace("/login");
    }

  }, [user, isAuthenticated, pathname, router]);

  // ⛔ Prevent flicker
  if (!isAuthenticated && pathname !== "/login") return null;

  return children;
}