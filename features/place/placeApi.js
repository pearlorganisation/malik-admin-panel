import { baseApi } from "@/services/baseApi";

export const placeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ================= GET ALL PLACES ================= */
    getAllPlaces: builder.query({
      query: () => ({
        url: "/places",
        method: "GET",
      }),
      providesTags: ["Places"],
    }),

    /* ================= GET PLACE BY ID ================= */
    getPlaceById: builder.query({
      query: (id) => ({
        url: `/places/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Places", id }],
    }),

    /* ================= CREATE PLACE ================= */
    createPlace: builder.mutation({
      query: (formData) => ({
        url: "/places",
        method: "POST",
        body: formData, // FormData (heroImage + fields)
      }),
      invalidatesTags: ["Places"],
    }),

    /* ================= UPDATE PLACE ================= */
    updatePlace: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/places/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Places",
        { type: "Places", id },
      ],
    }),

    /* ================= DELETE PLACE ================= */
    deletePlace: builder.mutation({
      query: (id) => ({
        url: `/places/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Places"],
    }),
  }),
});

export const {
  useGetAllPlacesQuery,
  useGetPlaceByIdQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
} = placeApi;
