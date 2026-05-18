/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL_SERVER: process.env.API_URL_SERVER,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig