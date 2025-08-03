/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disabilita temporaneamente i controlli di lint durante il build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disabilita temporaneamente i controlli TypeScript durante il build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;