import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin the workspace root explicitly. Without this, Next walks up from the
  // project looking for lockfiles and can pick a stray lockfile outside the
  // repository, which would let module resolution escape the project and pull a
  // different dependency version (e.g. react 19.3.0 instead of the pinned
  // 19.2.7). turbopack.root only allows resolution inside this directory and
  // outputFileTracingRoot keeps the standalone trace anchored to it.
  turbopack: {
    root: __dirname,
  },
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "vercel.com" },
    ],
  },
};

export default nextConfig;
