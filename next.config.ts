import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rawBackendOrigin =
  process.env.BACKEND_ORIGIN ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

const backendOrigin = rawBackendOrigin
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
