import type { NextConfig } from "next";

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

export default nextConfig;
