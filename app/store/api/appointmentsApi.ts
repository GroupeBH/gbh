import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./baseQuery";
import type { Appointment, AppointmentsResponse } from "./types";

type CreateAppointmentResponse = {
  appointment: Appointment;
  availableSlots?: string[];
};

type CreateAppointmentPayload = Partial<Appointment> & {
  serviceId: string;
  deviceToken?: string;
};

export const appointmentsApi = createApi({
  reducerPath: "appointmentsApi",
  baseQuery,
  tagTypes: ["Appointments"],
  endpoints: (builder) => ({
    createAppointment: builder.mutation<
      Appointment,
      CreateAppointmentPayload
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
    lookupAppointment: builder.mutation<Appointment, { id: string }>({
      queryFn: async (body, _api, _extraOptions, fetchWithBQ) => {
        const lookupResult = await fetchWithBQ({
          url: "appointments/lookup",
          method: "POST",
          body,
        });

        if (!lookupResult.error) {
          return { data: lookupResult.data as Appointment };
        }

        const status =
          typeof lookupResult.error.status === "number"
            ? lookupResult.error.status
            : null;

        if (status === 404 || status === 405) {
          const fallbackResult = await fetchWithBQ(
            `appointments/${encodeURIComponent(body.id)}`,
          );
          if (!fallbackResult.error) {
            return { data: fallbackResult.data as Appointment };
          }
          return { error: fallbackResult.error };
        }

        return { error: lookupResult.error };
      },
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
  useLookupAppointmentMutation,
  useAdminListAppointmentsQuery,
  useAdminUpdateAppointmentStatusMutation,
} = appointmentsApi;
