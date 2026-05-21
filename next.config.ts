import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow up to 20 MB request bodies — needed for base64-encoded screenshots
    // sent to /api/lexi/analyze (3 images × ~4 MB each = ~12 MB).
    serverBodySizeLimit: "20mb",
  },
};

export default nextConfig;
