import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative assets work on standard GoDaddy shared hosting subdirectories or root
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
