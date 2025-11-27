import { type NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // Hình ảnh
  images: {
    remotePatterns: [
      // Không cần localhost nữa vì đã dùng rewrite
      // Các host production
      { protocol: "https", hostname: "bizweb.dktcdn.net", pathname: "/**" },
      {
        protocol: "https",
        hostname: "i1-vnexpress.vnecdn.net",
        pathname: "/**",
      },
      { protocol: "https", hostname: "i1-giadinh.vnecdn.net", pathname: "/**" },
      { protocol: "https", hostname: "*.vnecdn.net", pathname: "/**" },
      { protocol: "https", hostname: "vnexpress.net", pathname: "/**" },
      { protocol: "https", hostname: "qr.sepay.vn", pathname: "/**" },
      {
        protocol: "https",
        hostname: "paddy.vn",
        pathname: "/cdn/shop/files/**",
      }, // bao phủ query ?v=...
    ],
    // chất lượng ảnh được phép
    qualities: [75, 100] as const,
    // Cache images
    minimumCacheTTL: 60,
  },
  // Optimize compilation
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Enable compression
  compress: true,
  // Optimize production builds

  // Power performance optimizations
  experimental: {
    optimizePackageImports: ["@ant-design/icons", "antd"],
  },
};

export default nextConfig;
