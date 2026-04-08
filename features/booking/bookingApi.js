import { baseApi } from "@/services/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    
    // Admin: List with filters
    getBookings: builder.query({
      query: ({ page = 1, limit = 10, search, status } = {}) => ({
        url: "/bookings",
        params: { page, limit, search, status },
      }),
      providesTags: ["Bookings"],
    }),

    // Get Single Detail
    getBookingById: builder.query({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Bookings", id }],
    }),

    // Admin: Update Status
    updateBookingStatus: builder.mutation({
      query: ({ id, status, paymentStatus }) => ({
        url: `/bookings/status/${id}`,
        method: "PATCH",
        body: { status, paymentStatus },
      }),
      invalidatesTags: ["Bookings"],
    }),

    // Admin: Delete
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const { 
  useGetBookingsQuery, 
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation
} = bookingApi;