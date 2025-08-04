import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bizweb.dktcdn.net",
        port: "",
        pathname: "/**",
      },
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
      {
        protocol: "https",
        hostname: "vnexpress.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
