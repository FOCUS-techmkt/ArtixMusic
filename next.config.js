/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      // Permite cualquier host https para que una URL de imagen externa
      // (pegada por el artista) nunca crashee next/image. La subida normal
      // sigue yendo a Cloudinary.
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
