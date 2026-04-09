import { baseApi } from "@/services/baseApi";

export const pageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPage: builder.mutation({
      query: (data) => ({ url: "/pages/create", method: "POST", body: data }),
      invalidatesTags: ["Pages"],
    }),
    getPages: builder.query({
      query: () => "/pages/all",
      providesTags: ["Pages"],
    }),
    getPageBySlug: builder.query({
      query: (slug) => `/pages/${slug}`,
      providesTags: (res, err, slug) => [{ type: "Pages", id: slug }],
    }),
    updatePage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pages/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Pages"],
    }),
    deletePage: builder.mutation({
      query: (id) => ({ url: `/pages/${id}`, method: "DELETE" }),
      invalidatesTags: ["Pages"],
    }),
  }),
});

export const { 
  useCreatePageMutation, 
  useGetPagesQuery, 
  useGetPageBySlugQuery, 
  useUpdatePageMutation,
  useDeletePageMutation 
} = pageApi;