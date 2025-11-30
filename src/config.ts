import type { ThemeConfig } from '@/types'

export const themeConfig: ThemeConfig = {
    site: {
        title: 'HAKU',
        subtitle: 'An simple astro theme',
        description: 'A demo',
        author: 'Jerry Karlbaey',
        base: '/',
        url: 'https://haku.karlbaey.top',
        favicon: '/src/assets/favicon.png'
    },
    global: {
        lang: 'zh',
        toc: true,
        dateFmt: 'YYYY MMM D' // 'YYYY-MM-DD' | 'MM-DD-YYYY' | 'DD-MM-YYYY' | 'MMM D YYYY' | 'D MMM YYYY'
    }
}

export default themeConfig

export const base = themeConfig.site.base === '/' ? '' : themeConfig.site.base.replace(/\/$/, '')
export const lang = themeConfig.global.lang