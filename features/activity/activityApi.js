import { baseApi } from "@/services/baseApi";

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* ================= GET ALL ================= */
    getActivities: builder.query({
      query: ({ page = 1, limit = 50, category, search, location } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (category) params.append("category", category);
        if (search) params.append("search", search);
        if (location) params.append("location", location);
        return `/activities?${params.toString()}`;
      },
      providesTags: ["Activity"],
    }),

    /* ================= GET BY ID ================= */
    getActivityById: builder.query({
      query: (id) => `/activities/${id}`,
      providesTags: (_, __, id) => [{ type: "Activity", id }],
    }),

    /* ================= CREATE ================= */
    createActivity: builder.mutation({
      query: (formData) => ({
        url: `/activities`,
        method: "POST",
        body: formData, // MUST be FormData
      }),
      invalidatesTags: ["Activity"],
    }),

    /* ================= UPDATE ================= */
    updateActivity: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/activities/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (_, __, { id }) => [
        "Activity",
        { type: "Activity", id },
      ],
    }),

    /* ================= DELETE ================= */
    deleteActivity: builder.mutation({
      query: (id) => ({
        url: `/activities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Activity"],
    }),

    /* ================= TOGGLE ACTIVE ================= */
    toggleActivityStatus: builder.mutation({
      query: (id) => ({
        url: `/activities/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: ["Activity"],
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useGetActivityByIdQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useToggleActivityStatusMutation,
} = activityApi;
