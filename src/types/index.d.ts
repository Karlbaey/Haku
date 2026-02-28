import type { CollectionEntry } from "astro:content";

export type Article = CollectionEntry<"articles"> & {
  remarkPluginFrontmatter: {
    minutes: number;
  };
};

export const langMap = {
  de: ["de-DE"],
  en: ["en-US"],
  es: ["es-ES"],
  fr: ["fr-FR"],
  ja: ["ja-JP"],
  ko: ["ko-KR"],
  pl: ["pl-PL"],
  pt: ["pt-BR"],
  ru: ["ru-RU"],
  zh: ["zh-CN"],
  "zh-tw": ["zh-TW"],
} as const;

// Supported Languages
export type Language = keyof typeof langMap;
export type CommentSystem = "giscus" | "waline";
export type SocialSharePlatform = "twitter" | "qq" | "mastodon";

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
    dateFmt:
      | "YYYY-MM-DD"
      | "MM-DD-YYYY"
      | "DD-MM-YYYY"
      | "YYYY MMM D"
      | "MMM D YYYY"
      | "D MMM YYYY";
  };
  color: {
    mode: "light" | "dark" | "auto";
    light: {
      primary: string;
      secondary: string;
      background: string;
      highlight: string;
    };
    dark: {
      primary: string;
      secondary: string;
      background: string;
      highlight: string;
    };
  };
  comments: {
    providers: [] | [CommentSystem] | [CommentSystem, CommentSystem];
    giscus: {
      enabled: boolean;
      host: string;
      repo: string;
      repoID: string;
      category: string;
      categoryID: string;
      mapping:
        | "pathname"
        | "url"
        | "title"
        | "og:title"
        | "specific"
        | "number";
      strict: "0" | "1";
      reactionsEnabled: "0" | "1";
      emitMetadata: "0" | "1";
      inputPosition: "top" | "bottom";
      theme: string;
      lang: string;
      loading: "lazy" | "eager";
      term?: string;
    };
    waline: {
      enabled: boolean;
      serverURL: string;
      lang: string;
      pageview: boolean;
      comment: boolean;
      search: boolean;
      login: "enable" | "disable" | "force";
      dark: string;
      requiredMeta: Array<"nick" | "mail" | "link">;
      emoji: string[];
    };
  };
  socialShare: {
    activated: boolean;
    providers: SocialSharePlatform[];
  };
  analytics: {
    googleAnalyticsID: string;
    umamiWebsiteID: string;
    umamiScriptSrc: string;
  };
}

export default ThemeConfig;
