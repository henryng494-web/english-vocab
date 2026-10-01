import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets `npm run build:check` build into a separate dir while `npm run dev` is running.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  serverExternalPackages: ["edge-tts-universal"],
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|icon.svg|manifest.webmanifest).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
