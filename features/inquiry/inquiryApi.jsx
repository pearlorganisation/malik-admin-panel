import { baseApi } from "@/services/baseApi";

export const inquiryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL INQUIRIES
    getAllInquiries: builder.query({
      query: () => ({
        url: "/inquiry", // Adjust based on your actual route prefix
        method: "GET",
      }),
      providesTags: ["Inquiries"],
    }),

    // GET SINGLE INQUIRY
    getInquiryById: builder.query({
      query: (id) => ({
        url: `/inquiry/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Inquiries", id }],
    }),

    // CREATE INQUIRY (Public)
    createInquiry: builder.mutation({
      query: (data) => ({
        url: "/inquiry/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inquiries"],
    }),

    // UPDATE STATUS
    updateInquiryStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/inquiry/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Inquiries",
        { type: "Inquiries", id },
      ],
    }),

    // DELETE INQUIRY
    deleteInquiry: builder.mutation({
      query: (id) => ({
        url: `/inquiry/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inquiries"],
    }),
  }),
});

export const {
  useGetAllInquiriesQuery,
  useGetInquiryByIdQuery,
  useCreateInquiryMutation,
  useUpdateInquiryStatusMutation,
  useDeleteInquiryMutation,
} = inquiryApi;