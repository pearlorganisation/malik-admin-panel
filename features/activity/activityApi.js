import { baseApi } from "@/services/baseApi";

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL ACTIVITIES
    getActivities: builder.query({
      query: ({ page = 1, limit = 10, isActive } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (isActive !== undefined) params.append("isActive", isActive);
        return `/activity?${params.toString()}`;
      },
      providesTags: ["Activity"],
    }),

    // GET SINGLE ACTIVITY
    getActivityById: builder.query({
      query: (id) => `/activity/${id}`,
      providesTags: (result, error, id) => [{ type: "Activity", id }],
    }),

    // CREATE ACTIVITY
    createActivity: builder.mutation({
      query: (data) => ({
        url: "/activity",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Activity"],
    }),

    // UPDATE ACTIVITY
    updateActivity: builder.mutation({
      query: ({ id, data }) => ({
        url: `/activity/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Activity"],
    }),

    // DELETE ACTIVITY
    deleteActivity: builder.mutation({
      query: (id) => ({
        url: `/activity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Activity"],
    }),

    // TOGGLE ACTIVE STATUS
    toggleActivityStatus: builder.mutation({
      query: (id) => ({
        url: `/activity/${id}/toggle-active`,
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
