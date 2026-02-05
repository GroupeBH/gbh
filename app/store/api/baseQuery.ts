import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiBase = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

export const baseQuery = fetchBaseQuery({
  baseUrl: `${apiBase}/api`,
  credentials: "include",
});
