import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production hardening. Policy: internal/deployment-privacy-rules.md
  productionBrowserSourceMaps: false,
  enablePrerenderSourceMaps: false,
  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },
  experimental: {
    serverSourceMaps: false,
    serverMinification: true,
  },
  async redirects() {
    return [
      { source: "/about", destination: "/", permanent: true },
      { source: "/work", destination: "/projects", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

