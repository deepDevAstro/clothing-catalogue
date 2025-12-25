/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "storage.googleapis.com",
      "res.cloudinary.com",
    ],
    formats: ["image/avif", "image/webp"],
  },
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
