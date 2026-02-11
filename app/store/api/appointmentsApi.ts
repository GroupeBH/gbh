import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./baseQuery";
import type { Appointment, AppointmentsResponse } from "./types";

type CreateAppointmentResponse = {
  appointment: Appointment;
  availableSlots?: string[];
};

export const appointmentsApi = createApi({
  reducerPath: "appointmentsApi",
  baseQuery,
  tagTypes: ["Appointments"],
  endpoints: (builder) => ({
    createAppointment: builder.mutation<
      Appointment,
      Partial<Appointment> & { serviceId: string }
    >({
      query: (body) => ({
        url: "appointments",
        method: "POST",
        body,
      }),
      transformResponse: (response: Appointment | CreateAppointmentResponse) =>
        "appointment" in response ? response.appointment : response,
      invalidatesTags: ["Appointments"],
    }),
    getAppointment: builder.query<Appointment, string>({
      query: (id) => `appointments/${id}`,
    }),
    adminListAppointments: builder.query<
      AppointmentsResponse,
      { date?: string } | void
    >({
      query: (args) => ({
        url: "admin/appointments",
        params: args && args.date ? { date: args.date } : undefined,
      }),
      providesTags: ["Appointments"],
    }),
    adminUpdateAppointmentStatus: builder.mutation<
      Appointment,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `admin/appointments/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Appointments"],
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useGetAppointmentQuery,
  useAdminListAppointmentsQuery,
  useAdminUpdateAppointmentStatusMutation,
} = appointmentsApi;
