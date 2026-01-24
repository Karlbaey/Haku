import type { CollectionEntry } from "astro:content";

export type Article = CollectionEntry<"articles"> & {
  remarkPluginFrontmatter: {
    minutes: number;
  };
};

export const langMap = {
  'de': ['de-DE'],
  'en': ['en-US'],
  'es': ['es-ES'],
  'fr': ['fr-FR'],
  'ja': ['ja-JP'],
  'ko': ['ko-KR'],
  'pl': ['pl-PL'],
  'pt': ['pt-BR'],
  'ru': ['ru-RU'],
  'zh': ['zh-CN'],
  'zh-tw': ['zh-TW'],
} as const

// Supported Languages
export type Language = keyof typeof langMap

export interface ThemeConfig {
  site: {
    title: string;
    subtitle: string;
    description: string;
    author: string;
    base: string;
    url: string;
    favicon: string;
  };
  global: {
    lang: Language;
    toc: boolean;
    dateFmt: 'YYYY-MM-DD' | 'MM-DD-YYYY' | 'DD-MM-YYYY' | 'YYYY MMM D' | 'MMM D YYYY' | 'D MMM YYYY'
  };
  color: {
    mode: 'light' | 'dark' | 'auto'
    light: {
      primary: string
      secondary: string
      background: string
      highlight: string
    }
    dark: {
      primary: string
      secondary: string
      background: string
      highlight: string
    }
  };
}

export default ThemeConfig;
