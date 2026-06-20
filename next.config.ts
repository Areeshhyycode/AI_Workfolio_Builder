import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project so Next does not pick up a stray
  // lockfile in the home directory when inferring file-tracing root.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
