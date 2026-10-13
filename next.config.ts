import type { NextConfig } from "next";

// STATIC_EXPORT=1 → `out/` for GitHub Pages (see scripts/build-pages.mjs). Otherwise a normal Next.js server build.
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(staticExport ? { output: "export", trailingSlash: true } : {}),
  basePath,
};

export default nextConfig;
