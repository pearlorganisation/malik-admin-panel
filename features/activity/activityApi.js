import { baseApi } from '@/services/baseApi';

export const activityApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    /* ================= SEARCH ================= */
    searchActivities: builder.query({
      query: ({ page = 1, limit = 50, category, search, location } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        if (location) params.append('location', location);
        return `/activity/search?${params.toString()}`;
      },
      providesTags: ['Activity'],
    }),

    /* ================= GET ALL ================= */
    getActivities: builder.query({
      query: ({ page = 1, limit = 50 } = {}) =>
        `/activity/search?page=${page}&limit=${limit}`,
      providesTags: ['Activity'],
    }),

    /* ================= GET BY ID ================= */
    getActivityById: builder.query({
      query: (id) => `/activity/get-activity/${id}`,
      providesTags: (_, __, id) => [{ type: 'Activity', id }],
    }),

    /* ================= CREATE ================= */
    createActivity: builder.mutation({
      query: (formData) => ({
        url: '/activity/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Activity'],
    }),

    /* ================= UPDATE ================= */
    updateActivity: builder.mutation({
      query: ({ id, data }) => ({
        url: `/activity/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        'Activity',
        { type: 'Activity', id },
      ],
    }),

    /* ================= DELETE ================= */
    deleteActivity: builder.mutation({
      query: (id) => ({
        url: `/activity/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Activity'],
    }),

    /* ================= TOGGLE ACTIVE ================= */
    toggleActivityStatus: builder.mutation({
      query: (id) => ({
        url: `/activity/toggle/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Activity'],
    }),

    /* ================= CREATE PACKAGE ================= */
    createPackage: builder.mutation({
      query: (packageData) => ({
        url: '/activity/create-package',
        method: 'POST',
        body: packageData,
      }),
      invalidatesTags: ['Activity', 'Package'],
    }),
/* ================= GET ALL PACKAGES ================= */
getAllPackages: builder.query({
  query: ({ page = 1, limit = 50 } = {}) =>
    `/activity/packages?page=${page}&limit=${limit}`,
  providesTags: ['Package'],
}),
// use in frontend const { data } = useGetAllPackagesQuery();

/* ================= GET PACKAGES BY ACTIVITY ================= */
getPackagesByActivity: builder.query({
  query: (activityId) => `/activity/packages/${activityId}`,
  providesTags: ['Package'],
}),
// use in frontend const { data, isLoading } = useGetPackagesByActivityQuery(activityId);
/* ================= GET PACKAGE BY ID ================= */
getPackageById: builder.query({
  query: (id) => `/activity/package/${id}`,
  providesTags: (result, error, id) => [{ type: 'Package', id }],
}),


// use in frontend const const { data } = useGetPackageByIdQuery(packageId);

    /* ================= UPDATE PACKAGE ================= */
    updatePackage: builder.mutation({
      query: ({ id, packageData }) => ({
        url: `/activity/update-package/${id}`,
        method: 'POST',
        body: packageData,
      }),
      invalidatesTags: ['Activity', 'Package'],
    }),
  }),
});

export const {
  useSearchActivitiesQuery,
  useGetActivitiesQuery,
  useGetActivityByIdQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useToggleActivityStatusMutation,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useGetPackagesByActivityQuery,
  useGetAllPackagesQuery,
  useGetPackageByIdQuery
} = activityApi;
