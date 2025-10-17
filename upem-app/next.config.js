/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // nécessaire pour permettre l'export statique sans traitement des images
  },
};

module.exports = nextConfig;
