import type { ThemeConfig } from '@/types'

export const themeConfig: ThemeConfig = {
    site: {
        title: 'HAKU',
        subtitle: 'A simple astro theme',
        description: 'A demo',
        author: 'Jerry Karlbaey',
        base: '/',
        url: 'https://haku.karlbaey.top',
        favicon: '/favicon.png'
    },
    global: {
        lang: 'zh',
        toc: true,
        dateFmt: 'YYYY MMM D' // 'YYYY-MM-DD' | 'MM-DD-YYYY' | 'DD-MM-YYYY' | 'MMM D YYYY' | 'D MMM YYYY'
    },
    color: {
    // default theme mode
    mode: 'light', // light | dark | auto
    light: {
      // primary color
      // used for title, hover, etc
      // oklch color picker: https://oklch.com/
      primary: 'oklch(25% 0.005 298)',
      // secondary color
      // used for post text
      secondary: 'oklch(40% 0.005 298)',
      // background color
      background: 'oklch(96% 0.005 298)',
      // highlight color
      // used for navbar, selected text, etc
      highlight: 'oklch(0.93 0.195089 103.2532 / 0.5)',
    },
    dark: {
      // primary color
      primary: 'oklch(92% 0.005 298)',
      // secondary color
      secondary: 'oklch(77% 0.005 298)',
      // background color
      background: 'oklch(22% 0.005 298)',
      // highlight color
      highlight: 'oklch(0.93 0.195089 103.2532 / 0.2)',
    },
  },
}

export default themeConfig

export const base = themeConfig.site.base === '/' ? '' : themeConfig.site.base.replace(/\/$/, '')
export const lang = themeConfig.global.lang