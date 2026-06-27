import type { NextConfig } from "next";

const serverActionAllowedOrigins =
  process.env.NODE_ENV === "development"
    ? ["localhost:3000", "127.0.0.1:3000", "*.devtunnels.ms"]
    : [];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: serverActionAllowedOrigins,
    },
  },
};

export default nextConfig;
