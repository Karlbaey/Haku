import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import themeConfig from '@/config';
import { getArticleDescription } from '@/utils/description';
import type { APIContext } from 'astro';

export async function GET(ctx: APIContext) {
    const articles = getCollection("articles");
    if (!ctx.site)
        throw new Error('site is not configured in astro.config.ts');
    return rss({
        title: themeConfig.site.title,
        description: themeConfig.site.description,
        site: themeConfig.site.url,
        items: (await articles).map((article) => ({
            title: article.data.title,
            pubDate: article.data.published,
            description: getArticleDescription(article, "feed"),
            link: `/article/${article.slug}`,
            customData: `<language>${themeConfig.global.lang}</language>`,
        })),
    })

}