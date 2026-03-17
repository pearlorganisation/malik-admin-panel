"use client";

import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ProtectedRoute({ children }) {

  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {

    if (pathname.startsWith("/login")) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "ADMIN") {
      toast.error("Unauthorized");
      router.replace("/login");
    }

  }, [user, pathname, router]);

  // wait until user state available
  if (!user && pathname !== "/login") {
    return null;
  }

  return children;
}