import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true, // React Strict Mode 활성화
  env: {
    TINA_PUBLIC_CLIENT_ID: "78269263-6720-41ba-ae5d-cf09ba20b4f2",
    TINA_PUBLIC_BRANCH: process.env.TINA_PUBLIC_BRANCH || "main",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.tina.io", // 허용할 이미지 호스트 도메인
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin", // TinaCMS 대시보드 접근 경로
        destination: "/admin/pages.tsx", // TinaCMS 대시보드 경로
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
