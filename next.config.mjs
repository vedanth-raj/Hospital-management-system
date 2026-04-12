/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  serverExternalPackages: ["pg", "mongoose", "firebase-admin"],
};

export default nextConfig;