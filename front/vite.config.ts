import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), // This plugin integrates Tailwind CSS with Vite
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Proxy API calls to your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
