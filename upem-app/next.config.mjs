/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // export statique pour Cloudflare Pages
  images: { unoptimized: true },
  trailingSlash: true
};
export default nextConfig;
