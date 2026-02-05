import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./baseQuery";
import type { ContactMessage, ContactsResponse } from "./types";

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  baseQuery,
  tagTypes: ["Contacts"],
  endpoints: (builder) => ({
    createContact: builder.mutation<
      ContactMessage,
      Omit<ContactMessage, "id" | "_id" | "createdAt">
    >({
      query: (body) => ({
        url: "contact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contacts"],
    }),
    adminListContacts: builder.query<ContactsResponse, void>({
      query: () => "admin/contacts",
      providesTags: ["Contacts"],
    }),
  }),
});

export const { useCreateContactMutation, useAdminListContactsQuery } = contactsApi;
