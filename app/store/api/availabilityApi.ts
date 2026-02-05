import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./baseQuery";
import type { AvailabilityResponse } from "./types";

export const availabilityApi = createApi({
  reducerPath: "availabilityApi",
  baseQuery,
  tagTypes: ["Availability"],
  endpoints: (builder) => ({
    getAvailability: builder.query<AvailabilityResponse, { date: string }>({
      query: ({ date }) => ({
        url: "availability",
        params: { date },
        credentials: "omit",
      }),
      providesTags: (result, error, arg) => [
        { type: "Availability" as const, id: arg.date },
      ],
    }),
  }),
});

export const { useGetAvailabilityQuery } = availabilityApi;
