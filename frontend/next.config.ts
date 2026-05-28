/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL_SERVER: process.env.API_URL_SERVER,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.asepblog.my.id',
        pathname: '/uploads/**',
      },
      // Cadangan jika Anda testing di localhost agar gambar tetap muncul
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig