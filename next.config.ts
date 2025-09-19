import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour Firebase Hosting
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Optimisations pour la navigation
  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
  
  // Compiler optimisations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimisations de performance
  poweredByHeader: false,
  
  // Optimisations de bundle
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
