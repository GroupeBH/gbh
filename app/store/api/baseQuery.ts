import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${apiBase}/api`,
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

const shouldTryRefresh = (args: string | FetchArgs) => {
  const url = getRequestUrl(args).replace(/^\/+/, "");

  if (!url.startsWith("admin/")) return false;

  return (
    !url.startsWith("admin/login") &&
    !url.startsWith("admin/register") &&
    !url.startsWith("admin/refresh") &&
    !url.startsWith("admin/logout")
  );
};

let refreshInFlight: Promise<boolean> | null = null;

const runRefresh = async (
  api: Parameters<typeof rawBaseQuery>[1],
  extraOptions: Parameters<typeof rawBaseQuery>[2],
) => {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshResult = await rawBaseQuery(
        { url: "admin/refresh", method: "POST", responseHandler: "content-type" },
        api,
        extraOptions,
      );

      if (!refreshResult.error) {
        return true;
      }

      const statusCode = getErrorStatusCode(refreshResult.error);
      return statusCode !== null && statusCode >= 200 && statusCode < 300;
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
};

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (isAuthError(result.error) && shouldTryRefresh(args)) {
    const refreshed = await runRefresh(api, extraOptions);

    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
