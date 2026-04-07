import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearUser } from "@/features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const baseQueryWithAuth = async (args, api, extraOptions) => {

  const result = await baseQuery(args, api, extraOptions);

  const isLoginRequest =
    typeof args === "object" && args.url?.includes("/auth/login");

  if (result?.error?.status === 401 && !isLoginRequest) {
    api.dispatch(clearUser());

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return result;
};
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Auth", "User", "Activity","Package", "Categories", "Places", "Spots","Contacts","Addons", "Bookings"],
  endpoints: () => ({}),
});