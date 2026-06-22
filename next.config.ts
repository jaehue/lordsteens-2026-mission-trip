import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // macmini 등 localhost 외 호스트(Tailscale)로 dev 접속 시
  // cross-origin 차단으로 하이드레이션이 깨지는 문제 방지
  allowedDevOrigins: ["macmini", "macmini.tail5adf3e.ts.net"],
};

export default nextConfig;
