import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./baseQuery";
import type { ReservationBlock } from "./types";

export const blocksApi = createApi({
  reducerPath: "blocksApi",
  baseQuery,
  tagTypes: ["Blocks"],
  endpoints: (builder) => ({
    adminCreateBlock: builder.mutation<
      ReservationBlock,
      { date: string; time: string; reason: string }
    >({
      query: (body) => ({
        url: "admin/blocks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Blocks"],
    }),
    adminDeleteBlock: builder.mutation<
      { status: string },
      { id: string; date?: string }
    >({
      query: ({ id }) => ({
        url: `admin/blocks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blocks"],
    }),
  }),
});

export const { useAdminCreateBlockMutation, useAdminDeleteBlockMutation } = blocksApi;
