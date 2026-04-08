"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/features/auth/authSlice";
import { useGetProfileQuery } from "@/features/auth/authApi";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data, isSuccess } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated, // ✅ KEY FIX
  });

  useEffect(() => {
    if (isSuccess && data?.user) {
      dispatch(setUser(data.user));
    }
  }, [isSuccess, data, dispatch]);

  return children;
}