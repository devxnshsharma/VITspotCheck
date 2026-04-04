/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Enables static HTML export
  output: isProd ? 'export' : undefined,
  
  // Since your repo is named 'VITspotCheck', GitHub Pages will host it at 
  // username.github.io/VITspotCheck. You must set the basePath.
  basePath: isProd ? '/VITspotCheck' : undefined,
  
  // GitHub Pages does not support the Next.js Image Optimization API.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
