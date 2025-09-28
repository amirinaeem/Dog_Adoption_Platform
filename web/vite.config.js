/** vite.config.js — Vite config w/ React SWC */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
});
