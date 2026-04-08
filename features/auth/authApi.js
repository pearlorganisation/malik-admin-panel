import { baseApi } from "@/services/baseApi.js";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    getProfile: builder.query({
      query: () => "/auth/me",
    }),

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
} = authApi;