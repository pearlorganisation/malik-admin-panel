import { baseApi } from "@/services/baseApi";

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

 getHotels: builder.query({
  query: (params) => { 
    return {
      url: "/hotel", // Backend route singular hai aapka
      method: "GET",
      params: params, // RTK query isse automatically ?search=nitin bana dega
    };
  },
  providesTags: ["Hotels"],
}),

    /**
     * 🔍 SEARCH + FILTER + PAGINATION
     */
    searchHotels: builder.query({
      query: ({ page = 1, limit = 10, search, minPrice, maxPrice } = {}) => ({
        url: "/hotel/search/all",
        params: { page, limit, search, minPrice, maxPrice },
      }),
      providesTags: ["Hotels"],
    }),

    /**
     * 🔎 GET SINGLE HOTEL
     */
    getHotelById: builder.query({
      query: (id) => `/hotel/${id}`,
      providesTags: ["Hotels"],
    }),

    /**
     * ➕ CREATE HOTEL
     */
    createHotel: builder.mutation({
      query: (data) => ({
        url: "/hotel",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Hotels"],
    }),

    /**
     * ✏️ UPDATE HOTEL
     */
    updateHotel: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hotel/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Hotels"],
    }),

    /**
     * ❌ HARD DELETE
     */
    deleteHotel: builder.mutation({
      query: (id) => ({
        url: `/hotel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hotels"],
    }),

    /**
     * 🗑️ SOFT DELETE
     */
    softDeleteHotel: builder.mutation({
      query: (id) => ({
        url: `/hotel/${id}/soft-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Hotels"],
    }),

    /**
     * ⭐ ADD REVIEW
     */
    addReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hotel/${id}/review`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Hotels"],
    }),

    /**
     * 🏆 TOP HOTELS
     */
    getTopHotels: builder.query({
      query: () => "/hotel/top/featured",
      providesTags: ["Hotels"],
    }),

    /**
     * 📍 NEARBY HOTELS
     */
    getNearbyHotels: builder.query({
      query: ({ lat, lng, distance = 5 }) => ({
        url: "/hotel/nearby/location",
        params: { lat, lng, distance },
      }),
      providesTags: ["Hotels"],
    }),

  }),
});

export const {
  useGetHotelsQuery,
  useSearchHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
  useSoftDeleteHotelMutation,
  useAddReviewMutation,
  useGetTopHotelsQuery,
  useGetNearbyHotelsQuery,
} = hotelApi;