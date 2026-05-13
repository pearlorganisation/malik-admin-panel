import { baseApi } from "@/services/baseApi"; 

export const languageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLanguages: builder.query({
      query: () => ({
        url: "/languages",
        method: "GET",
      }),
      providesTags: ["Languages"],
    }),
    addLanguage: builder.mutation({
      query: (data) => ({
        url: "/languages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Languages"],
    }),
    deleteLanguage: builder.mutation({
      query: (id) => ({
        url: `/languages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Languages"],
    }),
  }),
});

export const { 
  useGetLanguagesQuery, 
  useAddLanguageMutation, 
  useDeleteLanguageMutation 
} = languageApi;