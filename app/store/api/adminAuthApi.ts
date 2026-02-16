import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./baseQuery";

export const adminAuthApi = createApi({
  reducerPath: "adminAuthApi",
  baseQuery,
  endpoints: (builder) => ({
    adminRegister: builder.mutation<
      { id?: string; _id?: string; username?: string; email?: string; role?: string },
      { username: string; email?: string; password: string; setupKey: string }
    >({
      query: (body) => ({
        url: "admin/register",
        method: "POST",
        body,
      }),
    }),
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
  useAdminRegisterMutation,
  useAdminLoginMutation,
  useAdminRefreshMutation,
  useAdminLogoutMutation,
} = adminAuthApi;
