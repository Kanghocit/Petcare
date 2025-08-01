import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i1-vnexpress.vnecdn.net",
      },
      {
        protocol: "https",
        hostname: "i1-giadinh.vnecdn.net",
      },
      {
        protocol: "https",
        hostname: "*.vnecdn.net",
      },
    ],
  },
};

export default nextConfig;
