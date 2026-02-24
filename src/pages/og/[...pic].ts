import { getCollection, type CollectionEntry } from "astro:content";
import { getArticleDescription } from "@/utils/description";
import themeConfig from "@/config";
import { OGImageRoute } from "astro-og-canvas";

const articles = await getCollection('articles');
const pages = Object.fromEntries(
    articles.map((article: CollectionEntry<'articles'>) => [
        article.slug,
        {
            title: article.data.title,
            description: getArticleDescription(article, 'og'),
        },
    ]),
)

export const { getStaticPaths, GET } = await OGImageRoute({
    param: 'pic',
    pages,
    getImageOptions: (_path, page) => ({
        title: page.title,
        description: page.description || themeConfig.site.description,
        logo: {
            path: './public/favicon.png', // 得是个本地路径
            size: [230],
        },
        border: {
            color: [250, 250, 250],
            width: 20,
        },
        font: {
            title: {
                families: ['Noto Sans SC'],
                weight: 'Bold',
                color: [26, 28, 35],
                lineHeight: 1.5,
            },
            description: {
                families: ['Noto Sans SC'],
                color: [60, 60, 60],
                lineHeight: 1.5,
            },
        },
        fonts: [
            "./public/fonts/NotoSansSC-Bold.otf",
            "./public/fonts/NotoSansSC-Regular.otf",
        ],
        bgGradient: [[251, 251, 251]],
        padding: 20,
    }),
})
