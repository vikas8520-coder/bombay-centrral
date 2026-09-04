import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve images directly — bypass Next.js image optimizer
    // More reliable for international CDN delivery
    unoptimized: true,
  },
};

export default nextConfig;
