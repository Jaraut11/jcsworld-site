import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jcsworld.in',
  output: 'server',          // <-- enables API POST on Vercel
  integrations: [sitemap()],
  adapter: vercel(),         // <-- serverless runtime (not edge/static)
});
