import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/auth",
    credentials: "include",
  }),
  tagTypes: ["Auth"],

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    getProfile: builder.query({
      query: () => "/me",
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,   // ✅ correct hook
  useGetProfileQuery,
} = authApi;