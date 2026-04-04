import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/My_Portfolio/",
  base: process.env.VITE_BASE_PATH || "/My_Portfolio/",
});