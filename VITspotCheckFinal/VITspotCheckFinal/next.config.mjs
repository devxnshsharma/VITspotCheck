/** @type {import('next').NextConfig} */
// Detect if we are deploying to GitHub Pages or Vercel
const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

// REPLACE 'VITspotCheckFinal' with your actual repository name if it differs for GitHub Pages
const repoName = 'VITspotCheckFinal';

const nextConfig = {
  // Enables static HTML export ONLY for GitHub Pages
  // Vercel handles dynamic/server logic automatically and doesn't need this
  output: isGithubPages ? 'export' : undefined,
  
  // Set the base path ONLY for GitHub Pages repository hosting
  // Vercel should remain at the root ('')
  basePath: isGithubPages ? `/${repoName}` : undefined,
  
  // Disable image optimization for GitHub Pages; Vercel can handle it, 
  // but keeping it unoptimized ensures consistency across both platforms.
  images: {
    unoptimized: true,
  },
  
  // Ensure trailing slashes are handled correctly for static hosting
  trailingSlash: true,
};

export default nextConfig;


