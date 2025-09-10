import { defineConfig } from 'astro/config';
import path from 'path';

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@styles': path.resolve('./src/pages/admin/styles'),
      },
    },
  },
});
