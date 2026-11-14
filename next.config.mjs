/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.E2E_DIST === "1" ? ".next-e2e" : ".next",
  allowedDevOrigins: process.env.E2E_DIST === "1" ? ["127.0.0.1"] : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  cacheComponents: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
