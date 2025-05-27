import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⚠️ 不要写 experimental.nodeMiddleware
  // 也不需要 runtime: "nodejs" 的 middleware
};

export default nextConfig;
