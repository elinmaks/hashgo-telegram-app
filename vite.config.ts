import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'src/client'),
  build: {
    outDir: '../../dist/client',
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
}); 