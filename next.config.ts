import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // pdfjs-dist optionally imports canvas for server-side rendering; not needed in browser
      canvas: { browser: './empty-module.js' },
    },
  },
};

export default nextConfig;
