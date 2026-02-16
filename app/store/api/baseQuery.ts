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

const isUnauthorized = (error?: FetchBaseQueryError) =>
  typeof error?.status === "number" && error.status === 401;

const getRequestUrl = (args: string | FetchArgs) =>
  typeof args === "string" ? args : args.url;

const shouldTryRefresh = (args: string | FetchArgs) => {
  const url = getRequestUrl(args);

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
        { url: "admin/refresh", method: "POST" },
        api,
        extraOptions,
      );

      return Boolean(refreshResult.data);
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

  if (isUnauthorized(result.error) && shouldTryRefresh(args)) {
    const refreshed = await runRefresh(api, extraOptions);

    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
