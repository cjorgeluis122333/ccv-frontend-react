import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // El base debe coincidir con el nombre del repositorio para GitHub Pages
  base: command === 'build' ? '/ccv-frontend-react/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Asegurar que las imágenes en public se copien correctamente
    copyPublicDir: true,
  }
}));
