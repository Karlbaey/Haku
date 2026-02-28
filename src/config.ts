import type { ThemeConfig } from "@/types";

export const themeConfig: ThemeConfig = {
  site: {
    // site title
    title: "Haku",
    // site subtitle
    subtitle: "A simple astro theme",
    // site description
    description: "A demo",
    // site author, show in footer
    author: "Hakubot",
    // where your site shows
    base: "/",
    // your url
    // like karlbaey.github.io for GitHub
    url: "https://haku.karlbaey.top",
    // in public/favicon.png
    favicon: "/favicon.png",
  },
  global: {
    // your site language， now is simplified Chinese
    lang: "zh", // "zh" | "de" | "en" | "es" | "fr" | "ja" | "ko" | "pl" | "pt" | "ru" | "zh-tw"
    // show table of content
    toc: true,
    dateFmt: "YYYY MMM D", // 'YYYY-MM-DD' | 'MM-DD-YYYY' | 'DD-MM-YYYY' | 'MMM D YYYY' | 'D MMM YYYY'
  },
  color: {
    // default theme mode
    mode: "light", // light | dark | auto
  },
  comments: {
    // you can use Giscus, Waline, or simply both
    providers: ["giscus", "waline"],
    // Giscus settings
    // see https://haku.karlbaey.top/articles/configuration#giscus-配置
    giscus: {
      enabled: true,
      host: "https://giscus.app",
      repo: "Karlbaey/Haku",
      repoID: "R_kgDOQWi63Q",
      category: "Announcements",
      categoryID: "DIC_kwDOQWi63c4CyFMJ",
      mapping: "pathname",
      strict: "0",
      reactionsEnabled: "1",
      emitMetadata: "0",
      inputPosition: "top",
      theme: "preferred_color_scheme",
      lang: "zh-CN",
      loading: "lazy",
    },
    // Waline settings
    // see https://haku.karlbaey.top/articles/configuration#waline-配置
    waline: {
      enabled: true,
      serverURL: "https://wa.karlbaey.top",
      lang: "zh",
      pageview: true,
      comment: true,
      search: false,
      login: "enable",
      dark: "html.dark",
      requiredMeta: ["nick", "mail"],
      emoji: [],
    },
  },
  // show social media sharing buttons
  socialShare: {
    activated: true,
    providers: ["twitter", "qq", "mastodon"],
  },
  // leave them empty if you do not want to use website analytics
  analytics: {
    // Create your own google analytics ID
    // https://analytics.google.com/analytics/web/
    googleAnalyticsID: "G-S7HGM3JPX0",
    // Create your own umami analytics ID
    // https://cloud.umami.is/analytics/us/websites/
    umamiWebsiteID: "5d00bd0c-2f51-43cc-9f70-099aa5d68bac",
    // Do not edit unless you host your own umami analytics
    umamiScriptSrc: "https://cloud.umami.is/script.js",
  },
};

export default themeConfig;

export const base =
  themeConfig.site.base === "/" ? "" : themeConfig.site.base.replace(/\/$/, "");
export const lang = themeConfig.global.lang;
