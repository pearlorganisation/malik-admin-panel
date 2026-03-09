import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearUser } from "@/features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    //  Clear redux state
    api.dispatch(clearUser());

    //  redirect login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Auth", "User", "Activity", "Categories", "Places", "Spots"],
  endpoints: () => ({}),
});