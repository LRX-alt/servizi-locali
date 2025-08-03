import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disabilita ESLint durante il build di produzione
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disabilita type checking durante il build se necessario
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
