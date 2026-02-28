import type { ThemeConfig } from "@/types";

export const themeConfig: ThemeConfig = {
  site: {
    title: "Haku",
    subtitle: "A simple astro theme",
    description: "A demo",
    author: "Hakubot",
    base: "/",
    url: "https://haku.karlbaey.top",
    favicon: "/favicon.png",
  },
  global: {
    lang: "zh",
    toc: true,
    dateFmt: "YYYY MMM D", // 'YYYY-MM-DD' | 'MM-DD-YYYY' | 'DD-MM-YYYY' | 'MMM D YYYY' | 'D MMM YYYY'
  },
  color: {
    // default theme mode
    mode: "light", // light | dark | auto
  },
  comments: {
    providers: ["giscus", "waline"],
    giscus: {
      enabled: true,
      host: "https://giscus.app",
      repo: "Karlbaey/astro-theme-haku",
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
  socialShare: {
    activated: true,
    providers: ["twitter", "qq", "mastodon"],
  },
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
