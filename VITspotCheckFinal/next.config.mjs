/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production' || process.env.GITHUB_ACTIONS === 'true';

// REPLACE 'VITspotCheckFinal' with your actual repository name if it differs
const repoName = 'VITspotCheckFinal';

const nextConfig = {
  // Enables static HTML export for GitHub Pages
  output: isProd ? 'export' : undefined,
  
  // Set the base path for repository-based hosting (username.github.io/repo-name)
  basePath: isProd ? `/${repoName}` : undefined,
  
  // Disable image optimization as GitHub Pages doesn't support the Next.js Image API
  images: {
    unoptimized: true,
  },
  
  // Ensure trailing slashes are handled correctly for static hosting
  trailingSlash: true,
};

export default nextConfig;

