import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Anchor the workspace to this repo. The parent directory contains a stray
  // package.json/lockfile that would otherwise be mis-inferred as the root.
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
