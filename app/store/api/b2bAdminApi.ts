import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./baseQuery";
import type {
  B2BCaseStudy,
  B2BCaseStudyListResponse,
  B2BCaseStudyUpsertRequest,
  B2BReference,
  B2BReferenceListResponse,
  B2BReferenceUpsertRequest,
  B2BRfpLead,
  B2BRfpListResponse,
  B2BRfpSource,
  B2BRfpStatus,
} from "./types";

type PaginatedArgs = {
  limit?: number;
  offset?: number;
};

type RfpAdminListArgs = PaginatedArgs & {
  status?: B2BRfpStatus;
  source?: B2BRfpSource;
};

type ReferenceAdminListArgs = PaginatedArgs & {
  category?: string;
};

type CaseStudyAdminListArgs = PaginatedArgs & {
  category?: string;
};

export const b2bAdminApi = createApi({
  reducerPath: "b2bAdminApi",
  baseQuery,
  tagTypes: ["B2BRfp", "B2BReferences", "B2BCaseStudies"],
  endpoints: (builder) => ({
    adminListRfp: builder.query<B2BRfpListResponse, RfpAdminListArgs | void>({
      query: (args) => ({
        url: "v1/admin/rfp",
        params: args ?? undefined,
      }),
      providesTags: (result) =>
        result?.items?.length
          ? [
              ...result.items.map((item) => ({ type: "B2BRfp" as const, id: item.id })),
              { type: "B2BRfp" as const, id: "LIST" },
            ]
          : [{ type: "B2BRfp" as const, id: "LIST" }],
    }),
    adminGetRfpById: builder.query<B2BRfpLead, string>({
      query: (id) => `v1/admin/rfp/${id}`,
      providesTags: (_result, _error, id) => [{ type: "B2BRfp", id }],
    }),
    adminUpdateRfpStatus: builder.mutation<
      B2BRfpLead,
      { id: string; status: B2BRfpStatus }
    >({
      query: ({ id, status }) => ({
        url: `v1/admin/rfp/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "B2BRfp", id },
        { type: "B2BRfp", id: "LIST" },
      ],
    }),
    adminListB2bReferences: builder.query<
      B2BReferenceListResponse,
      ReferenceAdminListArgs | void
    >({
      query: (args) => ({
        url: "v1/admin/references",
        params: args ?? undefined,
      }),
      providesTags: (result) =>
        result?.items?.length
          ? [
              ...result.items.map((item) => ({
                type: "B2BReferences" as const,
                id: item.id,
              })),
              { type: "B2BReferences" as const, id: "LIST" },
            ]
          : [{ type: "B2BReferences" as const, id: "LIST" }],
    }),
    adminCreateB2bReference: builder.mutation<B2BReference, B2BReferenceUpsertRequest>({
      query: (body) => ({
        url: "v1/admin/references",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "B2BReferences", id: "LIST" }],
    }),
    adminUpdateB2bReference: builder.mutation<
      B2BReference,
      { id: string } & B2BReferenceUpsertRequest
    >({
      query: ({ id, ...body }) => ({
        url: `v1/admin/references/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "B2BReferences", id },
        { type: "B2BReferences", id: "LIST" },
      ],
    }),
    adminDeleteB2bReference: builder.mutation<{ status: string }, { id: string }>({
      query: ({ id }) => ({
        url: `v1/admin/references/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "B2BReferences", id },
        { type: "B2BReferences", id: "LIST" },
      ],
    }),
    adminListB2bCaseStudies: builder.query<
      B2BCaseStudyListResponse,
      CaseStudyAdminListArgs | void
    >({
      query: (args) => ({
        url: "v1/admin/case-studies",
        params: args ?? undefined,
      }),
      providesTags: (result) =>
        result?.items?.length
          ? [
              ...result.items.map((item) => ({
                type: "B2BCaseStudies" as const,
                id: item.id,
              })),
              { type: "B2BCaseStudies" as const, id: "LIST" },
            ]
          : [{ type: "B2BCaseStudies" as const, id: "LIST" }],
    }),
    adminCreateB2bCaseStudy: builder.mutation<B2BCaseStudy, B2BCaseStudyUpsertRequest>({
      query: (body) => ({
        url: "v1/admin/case-studies",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "B2BCaseStudies", id: "LIST" }],
    }),
    adminUpdateB2bCaseStudy: builder.mutation<
      B2BCaseStudy,
      { id: string } & B2BCaseStudyUpsertRequest
    >({
      query: ({ id, ...body }) => ({
        url: `v1/admin/case-studies/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "B2BCaseStudies", id },
        { type: "B2BCaseStudies", id: "LIST" },
      ],
    }),
    adminDeleteB2bCaseStudy: builder.mutation<{ status: string }, { id: string }>({
      query: ({ id }) => ({
        url: `v1/admin/case-studies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "B2BCaseStudies", id },
        { type: "B2BCaseStudies", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useAdminListRfpQuery,
  useAdminGetRfpByIdQuery,
  useAdminUpdateRfpStatusMutation,
  useAdminListB2bReferencesQuery,
  useAdminCreateB2bReferenceMutation,
  useAdminUpdateB2bReferenceMutation,
  useAdminDeleteB2bReferenceMutation,
  useAdminListB2bCaseStudiesQuery,
  useAdminCreateB2bCaseStudyMutation,
  useAdminUpdateB2bCaseStudyMutation,
  useAdminDeleteB2bCaseStudyMutation,
} = b2bAdminApi;
