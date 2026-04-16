import type { NextConfig } from "next";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
    ],
  },
  async rewrites() {
    return [
      // Auth API: Path=/auth 쿠키가 전송되려면 요청 경로가 /auth/*이어야 함
      {
        source: "/auth/google",
        destination: `${API_BASE_URL}/auth/google`,
      },
      {
        source: "/auth/refresh",
        destination: `${API_BASE_URL}/auth/refresh`,
      },
      {
        source: "/auth/logout",
        destination: `${API_BASE_URL}/auth/logout`,
      },
      // 나머지 API
      {
        source: "/api/backend/:path*",
        destination: `${API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
