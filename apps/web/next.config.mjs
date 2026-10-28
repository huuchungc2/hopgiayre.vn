/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      {
        source: '/upload/:path*',
        destination: 'http://localhost:3001/upload/:path*',
      },
      {
        source: '/images/:path*',
        destination: 'http://localhost:3001/images/:path*',
      },
      {
        source: '/includehome/:path*',
        destination: 'http://localhost:3001/includehome/:path*',
      },
    ];
  },
};

export default nextConfig;
