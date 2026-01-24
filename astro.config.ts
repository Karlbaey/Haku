// @ts-check
import { defineConfig } from 'astro/config'
import { base, themeConfig } from './src/config'
import { remarkReadingTime } from './src/components/scripts/remark-readingtime.mjs';
import { remarkContainerDirectives } from './src/components/scripts/remark-sp-containers.mjs';

import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

const { url: site } = themeConfig.site

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    remarkPlugins: [
      remarkReadingTime,
      remarkDirective,
      remarkContainerDirectives,
      remarkMath,
    ],
    rehypePlugins: [
      [rehypeMermaid, { strategy: "pre-mermaid" }],
      rehypeKatex,
    ],
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid']
    },
    shikiConfig: {
      theme: "monokai"
    }
  },

  integrations: [mdx()],
});