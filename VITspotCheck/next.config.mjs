/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables static HTML export
  output: 'export',
  
  // Since your repo is named 'VITspotCheck', GitHub Pages will host it at 
  // username.github.io/VITspotCheck. You must set the basePath.
  basePath: '/VITspotCheck',
  
  // GitHub Pages does not support the Next.js Image Optimization API.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
