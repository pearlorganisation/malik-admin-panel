import { baseApi } from "@/services/baseApi";

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: ({ page = 1, limit = 10, search } = {}) => ({
        url: "/hotel",
        params: { page, limit, search },
      }),
      providesTags: ["Hotels"],
    }),
    getHotelById: builder.query({
      query: (id) => ({
        url: `/hotel/${id}`,
        method: "GET",
      }),
      providesTags: ["Hotels"],
    }),

    createHotel: builder.mutation({
      query: (data) => ({
        url: "/hotel",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Hotels"],
    }),
    updateHotel: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hotel/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Hotels"],
    }),

    deleteHotel: builder.mutation({
      query: (id) => ({
        url: `/hotel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hotels"],
    }),

  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelApi;