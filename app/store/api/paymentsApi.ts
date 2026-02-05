import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./baseQuery";
import type { PaymentIntentResponse } from "./types";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery,
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<
      PaymentIntentResponse,
      { appointmentId: string }
    >({
      query: (body) => ({
        url: "payments/intent",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentsApi;
