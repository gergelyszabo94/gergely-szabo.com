import { defineConfig } from 'astro/config';

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://www.gergely-szabo.com/',
  integrations: [sitemap()]
});