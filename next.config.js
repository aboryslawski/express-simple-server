/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Rewrite /backend/* to /api/* (backend processing)
      {
        source: '/backend/:path*',
        destination: '/api/:path*',
      },
      // Rewrite /process/* to backend processor with action parameter
      {
        source: '/process/:action',
        destination: '/api/backend-processor?action=:action',
      },
      // Keep API routes internal
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      }
    ];
  },
  async redirects() {
    return [
      // Example: redirect old paths to new ones
      {
        source: '/old-path',
        destination: '/',
        permanent: false,
      }
    ];
  }
};

module.exports = nextConfig;