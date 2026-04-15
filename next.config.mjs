/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  serverExternalPackages: ["pg", "firebase-admin"],
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: undefined,
  },
};

export default nextConfig;