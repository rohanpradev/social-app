/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
    typedRoutes: true,
  },
};

export default nextConfig;
