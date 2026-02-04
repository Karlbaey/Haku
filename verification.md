# 功能与验证记录

## 已完成的改动与新增功能
- 内容组织与导航：首页分页、标签索引与标签归档页（含分页），并按年份分组文章列表。
- 文章页增强：封面渲染、标签列表、分享按钮、评论占位（Giscus 可配置）。
- SEO/社交元信息：OG/Twitter、主题色、RSS 链接与可选分析脚本注入。
- RSS 与 Sitemap：`/rss.xml` 与 `/sitemap.xml`。
- 阅读体验：返回顶部按钮与全局色彩变量。
- 配置中心扩展：分页、社交、分析、评论与默认 OG 图等配置项。
- 默认 OG 图片：`public/og-default.svg`。
- Mermaid 渲染：通过 `ENABLE_MERMAID` 环境变量可选启用。

## 打开浏览器访问
- 首页：`/`（分页、置顶与列表展示）
- 标签索引：`/tags/`
- 标签归档：`/tags/<tag>/`
- 文章详情：`/articles/<slug>/`（封面/标签/分享/评论占位）
- RSS：`/rss.xml`
- Sitemap：`/sitemap.xml`

## 配置项验证
在 `src/config.ts` 中可调整并验证：
- `content.pageSize`：影响首页与标签分页数量。
- `site.defaultOgImage`：OG/Twitter 分享图。
- `analytics`：Plausible/Umami/GA4 脚本注入。
- `comments`：Giscus 评论参数。

## Mermaid 可选渲染
- 默认关闭（避免 Playwright 依赖问题）。
- 需要启用时使用：
  ```bash
  ENABLE_MERMAID=true pnpm build
  ```
