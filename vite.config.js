// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Vite configuration to include Tailwind plugin
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
});
