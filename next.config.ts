import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/instagram-shadowban-checker", destination: "/instagram" },
      { source: "/tiktok-shadowban-checker", destination: "/tiktok" },
      { source: "/reddit-shadowban-checker", destination: "/reddit" },
      { source: "/facebook", destination: "/facebook-shadowban-checker" },
    ];
  },
};

export default nextConfig;
