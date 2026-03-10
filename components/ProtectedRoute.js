"use client";

import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/login") return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      toast.error("You are not authorized to access the dashboard");
      router.replace("/login");
    }
  }, [user, router, pathname]);

  return children;
}