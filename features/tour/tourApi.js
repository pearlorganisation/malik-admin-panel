import { baseApi } from '@/services/baseApi';

export const tourApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    
    /* ================= GET ALL BOOKINGS ================= */
    getAllTours: builder.query({
      query: () => ({
        url: "/tours/all",
        method: "GET",
      }),
      providesTags: ['Tours'],
    }),

    /* ================= GET BY ID ================= */
    getTourById: builder.query({
      query: (id) => `/tours/${id}`,
      providesTags: (_, __, id) => [{ type: 'Tours', id }],
    }),

    /* ================= DELETE BOOKING ================= */
    deleteTour: builder.mutation({
      query: (id) => ({
        url: `/tours/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tours'],
    }),
  }),
});

export const {
  useGetAllToursQuery,
  useGetTourByIdQuery,
  useDeleteTourMutation
} = tourApi;