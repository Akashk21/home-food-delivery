/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Disable SWC and use Babel instead (fixes issues with OneDrive paths and some Windows setups)
  swcMinify: false,
};

module.exports = nextConfig;
