import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import themeConfig from '@/config';
import { getArticleDescription } from '@/utils/description';
import type { APIContext } from 'astro';

export async function GET(ctx: APIContext) {
    const articles = await getCollection("articles");

    if (!ctx.site)
        throw new Error('site is not configured in astro.config.ts');

    const sortedArticles = articles.sort((a, b) => {
        const dateA = new Date(a.data.published).getTime();
        const dateB = new Date(b.data.published).getTime();
        return dateB - dateA;
    }).slice(0, 5);

    return rss({
        title: themeConfig.site.title,
        description: themeConfig.site.description,
        site: themeConfig.site.url,
        items: sortedArticles.map((article) => ({
            title: article.data.title,
            pubDate: article.data.published,
            description: getArticleDescription(article, "feed"),
            link: article.data.permalink ? `/articles/${article.data.permalink}` : `/articles/${article.id}/`,
            customData: `<language>${themeConfig.global.lang}</language>`,
        })),
        stylesheet: "/feed/feed.xml.xsl",
    })
}