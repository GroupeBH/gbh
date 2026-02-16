import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setAdminAuthenticated, setAdminSearch } from "../adminSlice";

const rawBaseQuery = fetchBaseQuery({
  // Use same-origin /api so browser can attach HttpOnly cookies reliably in production.
  baseUrl: "/api",
  credentials: "include",
});

const getErrorStatusCode = (error?: FetchBaseQueryError) => {
  if (!error) return null;

  if (typeof error.status === "number") {
    return error.status;
  }

  if ("originalStatus" in error && typeof error.originalStatus === "number") {
    return error.originalStatus;
  }

  return null;
};

const isAuthError = (error?: FetchBaseQueryError) => {
  const statusCode = getErrorStatusCode(error);
  return statusCode === 401 || statusCode === 403;
};

const getRequestUrl = (args: string | FetchArgs) =>
  typeof args === "string" ? args : args.url;

const isAdminRequest = (args: string | FetchArgs) =>
  getRequestUrl(args).replace(/^\/+/, "").startsWith("admin/");

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (isAdminRequest(args) && isAuthError(result.error)) {
    api.dispatch(setAdminAuthenticated(false));
    api.dispatch(setAdminSearch(""));
  }

  return result;
};
