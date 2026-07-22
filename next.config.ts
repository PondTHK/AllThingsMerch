import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'fastestlap.store',
      },
      {
        protocol: 'https',
        hostname: 'img.sasom.co.th',
      },
    ],
  },
};

export default nextConfig;
