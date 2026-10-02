import type { NextConfig } from "next";

const isMobileBuild = process.env.MOBILE_BUILD === "1";

const nextConfig: NextConfig = {
  ...(isMobileBuild ? { output: "export" as const, trailingSlash: true } : {}),
  // Lets `npm run build:check` build into a separate dir while `npm run dev` is running.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  serverExternalPackages: ["edge-tts-universal"],
  async headers() {
    if (isMobileBuild) return [];
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
  webpack(config, { isServer, webpack }) {
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /curated-image-keywords-loader(\.ts)?$/,
          (resource: { request: string }) => {
            if (!resource.request.endsWith(".client")) {
              resource.request = resource.request.replace(
                /curated-image-keywords-loader(\.ts)?$/,
                "curated-image-keywords-loader.client",
              );
            }
          },
        ),
      );
    }
    return config;
  },
  images: {
    unoptimized: isMobileBuild,
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
