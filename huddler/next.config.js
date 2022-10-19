/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')
  ({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    customKey: process.env.GOOGLE_API_KEY,
  },

});

module.exports = nextConfig;
