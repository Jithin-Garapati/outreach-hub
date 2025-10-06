import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure proper transpilation of xlsx module
  transpilePackages: ['xlsx'],
  
  webpack: (config, { isServer, webpack }) => {
    // Fix for xlsx library
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        crypto: false,
        buffer: false,
        stream: false,
        util: false,
      };

      // Provide Buffer and process for xlsx
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }

    // Optimize chunk splitting for xlsx
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization?.splitChunks,
        cacheGroups: {
          ...(config.optimization?.splitChunks as any)?.cacheGroups,
          xlsx: {
            test: /[\\/]node_modules[\\/]xlsx[\\/]/,
            name: 'xlsx',
            chunks: 'all',
            priority: 10,
          },
        },
      },
    };

    return config;
  },
};

export default nextConfig;
