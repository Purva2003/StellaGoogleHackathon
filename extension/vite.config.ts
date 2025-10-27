// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';

// Import the manifest file
import manifest from './manifest.json';

export default defineConfig({
  // Set the root to the project directory
  root: resolve(__dirname),

  plugins: [
    react(),
    // Cast manifest as any for quick setup, CRXJS handles the complexity
    crx({ manifest: manifest as any }) 
  ],

  // Define output directory for the extension build
  build: {
    outDir: resolve(__dirname, '..', 'dist'),
    emptyOutDir: true,
  },

  // Add a simple alias (optional but helpful)
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});