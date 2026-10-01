import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Keep development assets available; ship only approved media via prerender.mjs.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  publicDir: command === 'build' ? false : 'public',
}));
