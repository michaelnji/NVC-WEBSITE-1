/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96],
    domains: [
      // Vercel Blob host used by your images
      "vsfzjpuomopk4jqa.public.blob.vercel-storage.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vsfzjpuomopk4jqa.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
