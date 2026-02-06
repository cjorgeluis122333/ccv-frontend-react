import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Si estamos en 'build' (producción), usamos la ruta del repo.
  // Si estamos en 'serve' (local), usamos la raíz.
  base: command === 'build' ? '/ccv-frontend-react/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));



