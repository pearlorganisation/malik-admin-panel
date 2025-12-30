import { baseApi } from "@/services/baseApi";

export const spotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ================= GET ALL SPOTS ================= */
    getAllSpots: builder.query({
      query: () => ({
        url: "/spots",
        method: "GET",
      }),
      providesTags: ["Spots"],
    }),

    /* ================= GET SINGLE SPOT ================= */
    getSpotById: builder.query({
      query: (id) => ({
        url: `/spots/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Spots", id }],
    }),

    /* ================= CREATE SPOT ================= */
    createSpot: builder.mutation({
      query: (formData) => ({
        url: "/spots",
        method: "POST",
        body: formData, // FormData (image + fields)
      }),
      invalidatesTags: ["Spots"],
    }),

    /* ================= UPDATE SPOT ================= */
    updateSpot: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/spots/${id}/example`,
        method: "PUT",
        body: formData, // FormData (optional image)
      }),
      invalidatesTags: (result, error, { id }) => [
        "Spots",
        { type: "Spots", id },
      ],
    }),

    /* ================= DELETE SPOT ================= */
    deleteSpot: builder.mutation({
      query: (id) => ({
        url: `/spots/${id}/example`,
        method: "DELETE",
      }),
      invalidatesTags: ["Spots"],
    }),
  }),
});

export const {
  useGetAllSpotsQuery,
  useGetSpotByIdQuery,
  useCreateSpotMutation,
  useUpdateSpotMutation,
  useDeleteSpotMutation,
} = spotApi;
