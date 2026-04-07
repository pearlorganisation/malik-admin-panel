import { baseApi } from "@/services/baseApi";

export const addonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /** 🔹 GET ALL ADDONS */
    getAddons: builder.query({
      query: ({ page = 1, limit = 10, search } = {}) => ({
        url: "/addons",
        params: { page, limit, search },
      }),
      providesTags: ["Addons"],
    }),

    /** 🔹 GET SINGLE ADDON */
    getAddonById: builder.query({
      query: (id) => ({
        url: `/addons/${id}`,
        method: "GET",
      }),
      providesTags: ["Addons"],
    }),

    /** 🔹 CREATE ADDON */
    createAddon: builder.mutation({
      query: (data) => ({
        url: "/addons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Addons"],
    }),

    /** 🔹 UPDATE ADDON */
    updateAddon: builder.mutation({
      query: ({ id, data }) => ({
        url: `/addons/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Addons"],
    }),

    /** 🔹 DELETE ADDON */
    deleteAddon: builder.mutation({
      query: (id) => ({
        url: `/addons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Addons"],
    }),

  }),
});

export const {
  useGetAddonsQuery,
  useGetAddonByIdQuery,
  useCreateAddonMutation,
  useUpdateAddonMutation,
  useDeleteAddonMutation,
} = addonApi;