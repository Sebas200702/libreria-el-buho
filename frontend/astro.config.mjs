// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: ['.preview.emergentagent.com', '.emergentcf.cloud', 'localhost', '127.0.0.1'],
      hmr: {
        clientPort: 443,
        protocol: 'wss',
      },
    },
  },
});
