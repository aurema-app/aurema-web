import path from "path";
import { fileURLToPath } from "url";

import type { NextConfig } from "next";

// Turbopack walks up the tree for lockfiles; a stray package-lock.json in ~/
// makes it treat the home dir as the workspace root and breaks HMR.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// HMR WebSocket upgrades are origin-checked in dev. localhost is always allowed;
// LAN IPs (e.g. phone at 192.168.x.x:3000) need explicit patterns once
// allowedDevOrigins is set. See allowedDevOrigins in Next.js docs.
const PRIVATE_LAN_ORIGINS = [
  "127.0.0.1",
  "192.168.*.*",
  "10.*.*.*",
  "172.*.*.*",
] as const;

function parseDevAllowedOrigins(): string[] {
  const fromEnv =
    process.env.DEV_ALLOWED_ORIGINS?.split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        try {
          return new URL(entry.includes("://") ? entry : `http://${entry}`)
            .hostname;
        } catch {
          return entry;
        }
      }) ?? [];

  return [...PRIVATE_LAN_ORIGINS, ...fromEnv];
}

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
  allowedDevOrigins: parseDevAllowedOrigins(),
};

export default nextConfig;
