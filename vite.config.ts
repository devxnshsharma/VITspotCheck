import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or whatever framework you are using

export default defineConfig({
  plugins: [react()],
  // Add this base property!
base: process.env.NODE_ENV === 'production' && !process.env.VERCEL ? '/VITspotCheckFinal/' : '/',})
