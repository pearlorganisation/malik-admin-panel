import { baseApi } from "@/services/baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({name, email, role}) => `/user?name=${name}&email=${email}&role=${role}`,
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
