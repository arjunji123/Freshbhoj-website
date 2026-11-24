import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The Fit page was renamed to BhojFit; keep old links working.
    return [{ source: "/fit", destination: "/bhojfit", permanent: true }];
  },
};

export default nextConfig;
