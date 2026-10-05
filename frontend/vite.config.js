import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // En desarrollo, redirige /api al backend local (npm start en /backend)
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
