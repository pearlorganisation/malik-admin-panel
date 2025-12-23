import { baseApi } from "@/services/baseApi";
export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: ({ page = 1, limit = 10, search, status }) => ({
        url: "/bookings",
        params: { page, limit, search, status },
      }),
      providesTags: ["Bookings"],
    }),
    getBookingById: builder.query({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "GET",
      }),
    }),
  }),
});
export const { useGetBookingsQuery, useGetBookingByIdQuery } = bookingApi;
