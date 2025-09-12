/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Solo ignorar durante builds en producción, no en desarrollo
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    // Solo ignorar errores de TypeScript en producción
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
