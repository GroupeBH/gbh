import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./baseQuery";

export const adminAuthApi = createApi({
  reducerPath: "adminAuthApi",
  baseQuery,
  endpoints: (builder) => ({
    adminLogin: builder.mutation<
      { status: string },
      { username: string; password: string }
    >({
      query: (body) => ({
        url: "admin/login",
        method: "POST",
        body,
      }),
    }),
    adminRefresh: builder.mutation<{ status: string }, void>({
      query: () => ({
        url: "admin/refresh",
        method: "POST",
      }),
    }),
    adminLogout: builder.mutation<{ status: string }, void>({
      query: () => ({
        url: "admin/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminRefreshMutation,
  useAdminLogoutMutation,
} = adminAuthApi;
