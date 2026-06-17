import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "www.microsoft.com",
      },
      {
        protocol: "https",
        hostname: "avatar.auth.microsoft.com",
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
