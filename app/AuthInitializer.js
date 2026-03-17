"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/features/auth/authSlice";
import { useGetProfileQuery } from "@/features/auth/authApi";

export default function AuthInitializer({ children }) {

  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetProfileQuery();

  useEffect(() => {

    if (data?.user) {
      dispatch(setUser(data.user));
    }

    if (error) {
      dispatch(clearUser());
    }

  }, [data, error, dispatch]);

  if (isLoading) return null;

  return children;
}