import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/x-shadowban-checker", destination: "/" },
      { source: "/twitter-shadowban-checker", destination: "/" },
      { source: "/instagram-shadowban-checker", destination: "/instagram" },
      { source: "/tiktok-shadowban-checker", destination: "/tiktok" },
      { source: "/reddit-shadowban-checker", destination: "/reddit" },
      { source: "/facebook", destination: "/facebook-shadowban-checker" },
      { source: "/youtube-shadowban-checker", destination: "/youtube" },
    ];
  },
};

export default nextConfig;
