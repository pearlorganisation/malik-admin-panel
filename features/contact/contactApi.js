import { baseApi } from "@/services/baseApi";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    // ADMIN: Get all contact queries
    getAllContacts: builder.query({
      query: () => ({
        url: "/contact",
        method: "GET",
      }),
      providesTags: ["Contacts"],
    }),

    // ADMIN: Update contact status
    updateContactStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/contact/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Contacts"],
    }),

  }),
});

export const {
  useGetAllContactsQuery,
  useUpdateContactStatusMutation,
} = contactApi;
