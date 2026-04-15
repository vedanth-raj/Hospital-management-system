/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  serverExternalPackages: ["pg", "firebase-admin"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;