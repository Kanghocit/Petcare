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
  // Turbopack config để tương thích với Next.js 16
  // Thêm config rỗng để tránh lỗi khi dùng Turbopack với webpack config
  turbopack: {},
  // Rewrite để proxy /images đến backend, tránh lỗi private IP
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
          "http://localhost:8000"
        }/images/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      // Không cần localhost nữa vì đã dùng rewrite
      {
        protocol: "https",
        hostname: "i1-vnexpress.vnecdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i1-giadinh.vnecdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.vnecdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
