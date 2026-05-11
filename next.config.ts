import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/dashboard/admin/:path*',
        destination: '/admin/:path*',
        permanent: true,
      },
      {
        source: '/admin/financials',
        destination: '/admin/payments',
        permanent: true,
      },
    ];
  },
};

const isDev = process.env.NODE_ENV === "development";

export default isDev ? nextConfig : withSerwist(nextConfig);
