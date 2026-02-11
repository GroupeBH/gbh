import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./baseQuery";
import type { Service, ServicesResponse } from "./types";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery,
  tagTypes: ["Services"],
  endpoints: (builder) => ({
    getServices: builder.query<ServicesResponse, void>({
      query: () => "services",
      providesTags: ["Services"],
    }),
    adminCreateService: builder.mutation<Service, Partial<Service>>({
      query: (body) => ({
        url: "admin/services",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Services"],
    }),
    adminUpdateService: builder.mutation<
      Service,
      { id: string } & Partial<Service>
    >({
      query: ({ id, ...body }) => ({
        url: `admin/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Services"],
    }),
    adminDeleteService: builder.mutation<{ status: string }, { id: string }>({
      query: ({ id }) => ({
        url: `admin/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useAdminCreateServiceMutation,
  useAdminUpdateServiceMutation,
  useAdminDeleteServiceMutation,
} = servicesApi;
