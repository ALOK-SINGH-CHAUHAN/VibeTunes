import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable React strict mode for development
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Optimize webpack hot module replacement configuration
      config.watchOptions = {
        aggregateTimeout: 300,
        poll: 1000,
      };
    }
    return config;
  },
  eslint: {
    // Ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  // Optimize development server configuration
  serverExternalPackages: [],
};

export default nextConfig;
