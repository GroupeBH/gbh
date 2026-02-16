import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./baseQuery";
import type {
  Service,
  ServicesResponse,
  ServiceTestimonial,
  ServiceTestimonialsResponse,
} from "./types";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery,
  tagTypes: ["Services", "Testimonials"],
  endpoints: (builder) => ({
    getServices: builder.query<ServicesResponse, void>({
      query: () => "services",
      providesTags: ["Services"],
    }),
    getServiceTestimonials: builder.query<ServiceTestimonialsResponse, string>({
      query: (serviceId) => `services/${serviceId}/testimonials`,
      providesTags: (_result, _error, serviceId) => [
        { type: "Testimonials", id: serviceId },
      ],
    }),
    createServiceTestimonial: builder.mutation<
      ServiceTestimonial,
      { serviceId: string; name: string; rating: number; message: string }
    >({
      query: ({ serviceId, ...body }) => ({
        url: `services/${serviceId}/testimonials`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, args) => [
        { type: "Testimonials", id: args.serviceId },
      ],
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
  useGetServiceTestimonialsQuery,
  useCreateServiceTestimonialMutation,
  useAdminCreateServiceMutation,
  useAdminUpdateServiceMutation,
  useAdminDeleteServiceMutation,
} = servicesApi;
