import { defineConfig } from "astro/config";
import { base, themeConfig } from "./src/config";
import { remarkReadingTime } from "./src/components/scripts/remark-readingtime.mjs";
import { remarkContainerDirectives } from "./src/components/scripts/remark-sp-containers.mjs";
import { rehypeArticleImages } from "./src/components/scripts/rehype-article-images.mjs";

import rehypeKatex from "rehype-katex";
import rehypeMermaid from "rehype-mermaid";
import rehypePrettyCode from "rehype-pretty-code";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import Compressor from "astro-compressor";

import partytown from "@astrojs/partytown";

const { url: site } = themeConfig.site;

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: "always",

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
      rehypeArticleImages,
      [
        rehypeMermaid,
        {
          strategy: "inline-svg",
          mermaidConfig: {
            theme: "default",
            flowchart: {
              useMaxWidth: true,
            },
          },
        },
      ],
      rehypeKatex,
      [
        rehypePrettyCode,
        {
          theme: "monokai",
          keepBackground: true,
        },
      ],
    ],
    syntaxHighlight: false,
  },

  integrations: [
    mdx(),
    sitemap(),
    Compressor({
      fileExtensions: [".css", ".js", ".mjs", ".html", ".cjs"],
    }),
    partytown(),
  ],
});
