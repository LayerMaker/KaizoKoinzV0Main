/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow serving files from the public directory
  // This is important for EmulatorJS to work properly
  async headers() {
    return [
      {
        // Matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      },
      {
        // Matching all static files in public directory
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET" },
        ]
      },
      {
        // Specifically for EmulatorJS files
        source: "/emulatorjs/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ]
      }
    ]
  },
  // Configure webpack to handle binary files
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(bin|sfc|smc|rom)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: '/_next/static/files',
            outputPath: 'static/files',
          },
        },
      ],
    });

    return config;
  },
}

module.exports = nextConfig
