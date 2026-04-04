/** @type {import('next').NextConfig} */

const nextConfig = {
  // Vercel handles API routes and dynamic rendering automatically.
  // We removed 'output: export' so your /api/admin/summary route will work perfectly.
  
  // We also removed 'basePath' because Vercel will host your project at the root domain
  // (e.g., your-project.vercel.app) rather than a subdirectory like GitHub Pages does.
  
  // Vercel natively supports image optimization, so you no longer need to force unoptimized images!
};

export default nextConfig;
