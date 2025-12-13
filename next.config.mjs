/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/src/api/:path*",
      },
    ];
  },
};

export default nextConfig;
