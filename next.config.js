/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// Only apply export settings in production build
if (process.env.NODE_ENV === 'production') {
  nextConfig.output = 'export';
  nextConfig.distDir = 'out';
  // Add basePath if your GitHub Pages site is hosted in a subfolder (repo name)
  nextConfig.basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/ping-map';
  nextConfig.images = {
    unoptimized: true,
  };
}

module.exports = nextConfig 