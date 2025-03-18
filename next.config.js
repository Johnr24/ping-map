/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'out',
  // Add basePath if your GitHub Pages site is hosted in a subfolder (repo name)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/ping-map',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 