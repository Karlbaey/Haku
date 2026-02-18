import type { CollectionEntry } from "astro:content"
import { getCollection, render } from "astro:content"
import { memoize } from "@/utils/cache"

export type Article = CollectionEntry<'articles'> & {
  remarkPluginFrontmatter: {
    minutes: number
  }
}

const metaCache = new Map<string, { minutes: number }>()

/**
 * Add metadata including reading time to a article
 *
 * @param article The article to enhance with metadata
 * @returns Enhanced article with reading time information
 */
async function addMetaToArticle(article: CollectionEntry<'articles'>): Promise<Article> {
  // Since this is a single-language site, the cache key no longer needs a language identifier.
  const cacheKey = article.id

  if (metaCache.has(cacheKey)) {
    return {
      ...article,
      remarkPluginFrontmatter: metaCache.get(cacheKey)!,
    }
  }

  const { remarkPluginFrontmatter } = await render(article)
  metaCache.set(cacheKey, remarkPluginFrontmatter as { minutes: number })

  return {
    ...article,
    remarkPluginFrontmatter: metaCache.get(cacheKey)!,
  }
}

async function _checkArticleSlugDuplication(articles: CollectionEntry<'articles'>[]): Promise<string[]> {
  const slugSet = new Set<string>()
  const duplicates: string[] = []

  articles.forEach((article) => {
    const slug = article.data.permalink || article.id

    if (slugSet.has(slug)) {
      duplicates.push(`Duplicate slug "${slug}" found`)
    }
    else {
      slugSet.add(slug)
    }
  })

  return duplicates
}

export const checkArticleSlugDuplication = memoize(_checkArticleSlugDuplication)

/**
 * Get all articles (including pinned ones, excluding drafts in production)
 *
 * @returns articles enhanced with metadata, sorted by date
 */
async function _getArticles() {
  const filteredarticles = await getCollection(
    'articles',
    ({ data }: CollectionEntry<'articles'>) => {
      // Show drafts in dev mode only
      return import.meta.env.DEV || !data.draft
    },
  )

  const enhancedarticles = await Promise.all(filteredarticles.map(addMetaToArticle))

  return enhancedarticles.sort((a: Article, b: Article) =>
    b.data.published.valueOf() - a.data.published.valueOf(),
  )
}

export const getArticles = memoize(_getArticles)

/**
 * Get all non-pinned articles
 *
 * @returns Regular articles (non-pinned)
 */
async function _getRegularArticles() {
  const articles = await getArticles()
  return articles.filter(article => !article.data.pin)
}

export const getRegularArticles = memoize(_getRegularArticles)

/**
 * Get pinned articles sorted by pin priority
 *
 * @returns Pinned articles sorted by pin value in descending order
 */
async function _getPinnedArticles() {
  const articles = await getArticles()
  return articles
    .filter(article => article.data.pin && article.data.pin > 0)
    .sort((a, b) => (b.data.pin ?? 0) - (a.data.pin ?? 0))
}

export const getPinnedArticles = memoize(_getPinnedArticles)

/**
 * Group articles by year and sort within each year
 *
 * @returns Map of articles grouped by year (descending), sorted by date within each year
 */
async function _getArticlesByYear(): Promise<Map<number, Article[]>> {
  const articles = await getRegularArticles()
  const yearMap = new Map<number, Article[]>()

  articles.forEach((article: Article) => {
    const year = article.data.published.getFullYear()
    if (!yearMap.has(year)) {
      yearMap.set(year, [])
    }
    yearMap.get(year)!.push(article)
  })

  // Sort articles within each year by date
  yearMap.forEach((yearArticles) => {
    yearArticles.sort((a, b) => {
      const aDate = a.data.published
      const bDate = b.data.published
      return bDate.getMonth() - aDate.getMonth() || bDate.getDate() - aDate.getDate()
    })
  })

  return new Map([...yearMap.entries()].sort((a, b) => b[0] - a[0]))
}

export const getArticlesByYear = memoize(_getArticlesByYear)

/**
 * Group articles by their tags
 *
 * @returns Map where keys are tag names and values are arrays of articles with that tag
 */
async function _getArticlesGroupByTags() {
  const articles = await getArticles()
  const tagMap = new Map<string, Article[]>()

  articles.forEach((article: Article) => {
    article.data.tags?.forEach((tag: string) => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, [])
      }
      tagMap.get(tag)!.push(article)
    })
  })

  return tagMap
}

export const getArticlesGroupByTags = memoize(_getArticlesGroupByTags)

/**
 * Get all tags sorted by article count
 *
 * @returns Array of tags sorted by popularity (most articles first)
 */
async function _getAllTags() {
  const tagMap = await getArticlesGroupByTags()
  const tagsWithCount = Array.from(tagMap.entries())

  tagsWithCount.sort((a, b) => b[1].length - a[1].length)
  return tagsWithCount.map(([tag]) => tag)
}

export const getAllTags = memoize(_getAllTags)

/**
 * Get all articles that contain a specific tag
 *
 * @param tag The tag name to filter articles by
 * @returns Array of articles that contain the specified tag
 */
async function _getArticlesByTag(tag: string) {
  const tagMap = await getArticlesGroupByTags()
  return tagMap.get(tag) ?? []
}

export const getArticlesByTag = memoize(_getArticlesByTag)
