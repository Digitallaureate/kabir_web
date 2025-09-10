import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://ecostory-site.web.app',
  output: 'server',
  adapter: node({
    mode: 'standalone',
    serverOptions: {
      port: parseInt(process.env.PORT || '8080')
    }
  }),
  integrations: [react()],
});