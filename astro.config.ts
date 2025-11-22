// @ts-check
import { defineConfig } from 'astro/config'
import { base, themeConfig } from './src/config'

import tailwindcss from '@tailwindcss/vite';

const { url: site } = themeConfig.site

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()],
  },
});