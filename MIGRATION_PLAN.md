# Astro 到 Hugo 迁移计划

这份计划按“先迁站，再抽主题”的思路编写，目标不是直接把现有 Astro 代码逐行翻译成 Hugo，而是先用 Hugo 重建同一套信息架构、内容模型和页面结构，最后再把稳定的布局层抽成主题。

本计划是根据当前仓库结构整理的，核心参考文件包括：

- [src/content.config.ts](/home/karlbaey/Repository/Haku/src/content.config.ts)
- [src/config.ts](/home/karlbaey/Repository/Haku/src/config.ts)
- [src/layout/Layout.astro](/home/karlbaey/Repository/Haku/src/layout/Layout.astro)
- [src/layout/Head.astro](/home/karlbaey/Repository/Haku/src/layout/Head.astro)
- [src/pages/index.astro](/home/karlbaey/Repository/Haku/src/pages/index.astro)
- [src/pages/page/[page].astro](/home/karlbaey/Repository/Haku/src/pages/page/[page].astro)
- [src/pages/articles/[...slug].astro](/home/karlbaey/Repository/Haku/src/pages/articles/[...slug].astro)
- [src/pages/tags/index.astro](/home/karlbaey/Repository/Haku/src/pages/tags/index.astro)
- [src/pages/tags/[tag].astro](/home/karlbaey/Repository/Haku/src/pages/tags/[tag].astro)
- [src/pages/friends/index.astro](/home/karlbaey/Repository/Haku/src/pages/friends/index.astro)
- [src/components/Articles/ArticleIndex.astro](/home/karlbaey/Repository/Haku/src/components/Articles/ArticleIndex.astro)
- [src/components/Articles/ArticleCard.astro](/home/karlbaey/Repository/Haku/src/components/Articles/ArticleCard.astro)
- [src/components/Articles/PaginationNav.astro](/home/karlbaey/Repository/Haku/src/components/Articles/PaginationNav.astro)
- [src/components/Meta/ArticleMeta.astro](/home/karlbaey/Repository/Haku/src/components/Meta/ArticleMeta.astro)
- [src/components/Navigation/Nav.astro](/home/karlbaey/Repository/Haku/src/components/Navigation/Nav.astro)
- [src/lib/articles.ts](/home/karlbaey/Repository/Haku/src/lib/articles.ts)
- [src/lib/tags.ts](/home/karlbaey/Repository/Haku/src/lib/tags.ts)
- [src/lib/datetime.ts](/home/karlbaey/Repository/Haku/src/lib/datetime.ts)
- [src/content/friends/links.ts](/home/karlbaey/Repository/Haku/src/content/friends/links.ts)
- [astro.config.ts](/home/karlbaey/Repository/Haku/astro.config.ts)
- [src/plugins/remark-container-directives.mjs](/home/karlbaey/Repository/Haku/src/plugins/remark-container-directives.mjs)
- [src/plugins/rehype-image-captions.mjs](/home/karlbaey/Repository/Haku/src/plugins/rehype-image-captions.mjs)
- [src/plugins/rehype-mermaid-client.mjs](/home/karlbaey/Repository/Haku/src/plugins/rehype-mermaid-client.mjs)

当前本机 Hugo 版本为 `v0.160.1 extended`。这意味着可以直接使用当前官方模板体系、render hooks、front matter 配置和 taxonomy/pagination 能力，不需要为了兼容旧版本而采用过时写法。

## 迁移原则

1. 不要在当前 Astro 根目录上边删边改。
2. 先把当前 Astro 仓库视为“规格来源”和“视觉对照组”。
3. 先重建站点，再抽离主题，不要一开始就做过度抽象。
4. 先迁页面结构和内容模型，再迁评论、搜索、Mermaid、图片查看器等增强功能。
5. 不要把 `src/lib/*.ts` 或 `src/plugins/*.mjs` 逐行翻译成 Go template，优先改用 Hugo 的原生能力。
6. 先复制现有 CSS 让页面尽快还原，不要边迁移边重设计。

## 当前站点范围

当前模板本质上是一个内容型博客，第一阶段要保留的核心能力只有这些：

- 首页文章列表
- 首页分页，路径格式为 `/page/2/`
- 文章详情页，路径格式为 `/articles/<slug>/`
- 标签总页 `/tags/`
- 标签详情页 `/tags/<tag>/`
- 友链页 `/friends/`
- 基础 SEO 元信息

这些页面和数据的关系已经在当前仓库里明确存在：

- 文章内容集合在 [src/content.config.ts](/home/karlbaey/Repository/Haku/src/content.config.ts)
- 文章路径和分页逻辑在 [src/lib/articles.ts](/home/karlbaey/Repository/Haku/src/lib/articles.ts)
- 标签聚合逻辑在 [src/lib/tags.ts](/home/karlbaey/Repository/Haku/src/lib/tags.ts)
- 全局配置在 [src/config.ts](/home/karlbaey/Repository/Haku/src/config.ts)
- SEO 头部在 [src/layout/Head.astro](/home/karlbaey/Repository/Haku/src/layout/Head.astro)
- Markdown 渲染增强在 [astro.config.ts](/home/karlbaey/Repository/Haku/astro.config.ts) 和 `src/plugins/`

第二阶段再补这些增强项：

- 评论系统
- 搜索覆盖层
- Mermaid 图表增强
- 图片放大与 Mermaid 图片查看器
- 代码块复制按钮
- 友链申请表单
- 分析脚本

## 迁移步骤

### 步骤 1：在 Astro 仓库旁边建立 Hugo 工作区

不要直接在当前目录覆盖 Astro 项目。推荐在旁边新建 Hugo 工作区，让这个 Astro 仓库继续作为参考实现。

```bash
cd ..
mkdir Haku-hugo
cd Haku-hugo
hugo new site . --format toml
mkdir -p content/articles content/friends data layouts/_partials layouts/_markup layouts/_shortcodes assets/css static
```

这一步完成后，先把所有布局和资源放在站点根目录的 `layouts/`、`assets/`、`static/`。等站点稳定后，再统一移动到 `themes/haku/` 或 Hugo Module。

### 步骤 2：初始化第一版 `hugo.toml`

先写一份最小可运行配置，保证 URL、分页、标签和基础站点参数与现有 Astro 站点一致。

```toml
baseURL = "https://re.karlbaey.top/"
languageCode = "zh-CN"
title = "Haku"
enableRobotsTXT = true

[taxonomies]
tag = "tags"

[pagination]
pagerSize = 7
path = "page"

[params]
subtitle = "卡尔白的纸箱📦"
description = "卡尔白的纸箱📦"
author = "Karlbaey"

[markup]
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 3
    ordered = false
  [markup.goldmark.parser]
    wrapStandAloneImageWithinParagraph = false

[frontmatter]
  date = ["date", "publishDate", "publishdate", "pubDate", "pubdate"]
  lastmod = ["lastmod", "modified", "updated"]
```

说明：

- `pagerSize = 7` 对应当前 [src/config.ts](/home/karlbaey/Repository/Haku/src/config.ts) 里的每页文章数。
- `path = "page"` 是为了保留当前 `/page/<n>/` 的分页路径。
- 上面的 `[frontmatter]` 是迁移兼容层，用来兼容当前 Astro 的 `pubDate` / `updated` 命名。
- 更稳妥的长期方案仍然是批量把 Markdown front matter 改成 Hugo 常用字段 `date` 和 `lastmod`。

### 步骤 3：迁内容、数据和静态资源

这一步只做“搬运”和“轻度改名”，不要先动页面模板。

#### 内容文件

- 把 [src/content/articles/](/home/karlbaey/Repository/Haku/src/content/articles/) 复制到 `content/articles/`
- 把 [src/content/friends/index.md](/home/karlbaey/Repository/Haku/src/content/friends/index.md) 复制到 `content/friends/_index.md`

#### 数据文件

把 [src/content/friends/links.ts](/home/karlbaey/Repository/Haku/src/content/friends/links.ts) 拆成 Hugo `data` 文件。建议变成 `data/friends.yaml` 或 `data/friends.toml`，例如：

```yaml
- name: 示例朋友
  url: https://example.com
  description: 这里写一小段站点介绍，后续可替换成真实友链信息。
  site: example.com
  avatar: https://example.com/avatar.png
  tags:
    - 博客
```

如果后续要保留“友链申请字段定义”，可以再把 `friendLinkFields` 单独转到 `data/friend_link_fields.yaml`，或直接写死到前端表单 partial 里。

#### 静态资源

- 把 `public/` 整体复制到 `static/`
- 把 [src/styles/](/home/karlbaey/Repository/Haku/src/styles/) 复制到 `assets/css/`
- 把 [src/assets/fonts/NotoSansCJKsc-Regular.otf](/home/karlbaey/Repository/Haku/src/assets/fonts/NotoSansCJKsc-Regular.otf) 移到 `static/fonts/` 或 `assets/fonts/`

迁移初期不建议重新引入 Tailwind。当前模板已经有独立 CSS 文件，直接复用成本更低。

### 步骤 4：统一文章 front matter

当前文章字段来源于 [src/content.config.ts](/home/karlbaey/Repository/Haku/src/content.config.ts)：

- `title`
- `pubDate`
- `description`
- `updated`
- `author`
- `draft`
- `tags`
- `permalink`
- `toc`
- `lang`

推荐的 Hugo 目标字段如下：

| Astro 字段 | Hugo 建议字段 | 说明 |
| --- | --- | --- |
| `title` | `title` | 保持不变 |
| `pubDate` | `date` | 推荐最终改名 |
| `updated` | `lastmod` | 推荐最终改名 |
| `description` | `description` | 保持不变 |
| `draft` | `draft` | 保持不变 |
| `tags` | `tags` | 配合 taxonomy 使用 |
| `permalink` | `slug` 或 `url` | 推荐优先使用 `slug` |
| `author` | `params.author` | 站点默认作者可在 `[params]` 中设置 |
| `toc` | `params.toc` | 页面级开关 |
| `lang` | `params.lang` | 单语站点可暂时放这里 |

建议最终把文章 front matter 改成类似下面的结构：

```yaml
title: 示例文章标题
date: 2026-03-28T16:56:36+08:00
lastmod: 2026-03-29T09:18:00+08:00
description: 这里是文章简介占位，后续可替换为真实摘要。
draft: false
tags:
  - 示例标签
slug: example
params:
  toc: true
  author: Karlbaey
  lang: zh-CN
```

如果有文章 URL 会变化，迁移时补 `aliases`，不要让旧链接直接失效。

### 步骤 5：先搭 Hugo 模板骨架，不要急着填细节

当前 Hugo 官方模板体系优先使用这些模板类型：

- `baseof.html`
- `home.html`
- `page.html`
- `section.html`
- `taxonomy.html`
- `term.html`

很多旧教程还在强调 `_default/single.html` 和 `_default/list.html`。这些知识在 lookup order 上仍有参考价值，但本项目不建议拿它们作为起点。

第一版建议的布局树如下：

```text
layouts/
  baseof.html
  home.html
  taxonomy.html
  term.html
  articles/
    page.html
  friends/
    section.html
  _partials/
    head.html
    nav.html
    article-card.html
    article-meta.html
    pagination.html
  _markup/
    render-image.html
    render-blockquote.html
    render-codeblock.html
    render-codeblock-mermaid.html
  _shortcodes/
    fold.html
```

### 步骤 6：按 Astro 现有结构一一映射模板

不要先写全新的 Hugo 主题结构。先做一轮明确映射。

| 当前 Astro 文件 | Hugo 对应位置 | 迁移说明 |
| --- | --- | --- |
| [src/layout/Layout.astro](/home/karlbaey/Repository/Haku/src/layout/Layout.astro) | `layouts/baseof.html` | 站点 HTML 外壳、全局 footer、全局脚本挂载点 |
| [src/layout/Head.astro](/home/karlbaey/Repository/Haku/src/layout/Head.astro) | `layouts/_partials/head.html` | `<title>`、description、canonical、OG、RSS、分析脚本等 |
| [src/components/Navigation/Nav.astro](/home/karlbaey/Repository/Haku/src/components/Navigation/Nav.astro) | `layouts/_partials/nav.html` | 导航和返回首页链接 |
| [src/components/Articles/ArticleCard.astro](/home/karlbaey/Repository/Haku/src/components/Articles/ArticleCard.astro) | `layouts/_partials/article-card.html` | 文章卡片 |
| [src/components/Meta/ArticleMeta.astro](/home/karlbaey/Repository/Haku/src/components/Meta/ArticleMeta.astro) | `layouts/_partials/article-meta.html` | 发布/更新/作者/标签展示 |
| [src/components/Articles/PaginationNav.astro](/home/karlbaey/Repository/Haku/src/components/Articles/PaginationNav.astro) | `layouts/_partials/pagination.html` | 分页组件 |
| [src/components/Articles/ArticleIndex.astro](/home/karlbaey/Repository/Haku/src/components/Articles/ArticleIndex.astro) | `layouts/home.html` + partials | 首页头部、列表和分页 |
| [src/pages/index.astro](/home/karlbaey/Repository/Haku/src/pages/index.astro) | `layouts/home.html` | 首页文章列表 |
| [src/pages/page/[page].astro](/home/karlbaey/Repository/Haku/src/pages/page/[page].astro) | `layouts/home.html` + Hugo pagination | 不再手写静态分页路由，改用 Hugo 原生分页 |
| [src/pages/articles/[...slug].astro](/home/karlbaey/Repository/Haku/src/pages/articles/[...slug].astro) | `layouts/articles/page.html` | 文章详情页 |
| [src/pages/tags/index.astro](/home/karlbaey/Repository/Haku/src/pages/tags/index.astro) | `layouts/taxonomy.html` 或 `layouts/term.html` | 标签总页，按你最终 taxonomy 组织落位 |
| [src/pages/tags/[tag].astro](/home/karlbaey/Repository/Haku/src/pages/tags/[tag].astro) | `layouts/taxonomy.html` 或 `layouts/term.html` | 标签详情页 |
| [src/pages/friends/index.astro](/home/karlbaey/Repository/Haku/src/pages/friends/index.astro) | `layouts/friends/section.html` | 友链页正文、申请区、卡片列表 |

补充说明：

- [src/lib/articles.ts](/home/karlbaey/Repository/Haku/src/lib/articles.ts) 里的“排序、URL、分页”逻辑，不要再用 TypeScript 重写一遍，改用 Hugo 的页面集合、分页和 front matter 能力。
- [src/lib/tags.ts](/home/karlbaey/Repository/Haku/src/lib/tags.ts) 可以被 Hugo taxonomy 直接替代。
- [src/lib/seo.ts](/home/karlbaey/Repository/Haku/src/lib/seo.ts) 的职责应收敛到 `head.html` partial 和 page params。

### 步骤 7：先实现页面主流程，再补页面增强

推荐的编码顺序如下：

1. `baseof.html`
2. `head.html`
3. `nav.html`
4. `home.html`
5. `article-card.html`
6. `pagination.html`
7. `articles/page.html`
8. `article-meta.html`
9. `taxonomy.html` / `term.html`
10. `friends/section.html`

原因很简单：

- 首页和文章页是内容站最核心的页面
- 标签页依赖 taxonomy，但实现复杂度不高
- 友链页依赖的数据结构已经独立，适合后补
- 评论、搜索、动画、查看器都不是迁移阻塞项

### 步骤 8：迁 Markdown 渲染链路

当前 Astro 的 Markdown 渲染增强集中在 [astro.config.ts](/home/karlbaey/Repository/Haku/astro.config.ts) 和这些插件里：

- [src/plugins/remark-container-directives.mjs](/home/karlbaey/Repository/Haku/src/plugins/remark-container-directives.mjs)
- [src/plugins/rehype-image-captions.mjs](/home/karlbaey/Repository/Haku/src/plugins/rehype-image-captions.mjs)
- [src/plugins/rehype-mermaid-client.mjs](/home/karlbaey/Repository/Haku/src/plugins/rehype-mermaid-client.mjs)

迁移时不要继续沿用“remark/rehype 插件思维”，而是拆成 Hugo 的原生能力。

#### 目录和导航

- 当前文章目录组件由 headings 数据驱动
- Hugo 里优先使用 `.TableOfContents`
- 文章 front matter 里的 `toc` 开关可以保留为 `params.toc`

#### 提示块和折叠块

- 当前 `remark-container-directives` 同时支持 GitHub 风格 `[!NOTE]` 和自定义 `:::fold[...]`
- Hugo 里，GitHub 风格提示块优先交给 `render-blockquote.html`
- `:::fold[...]` 不建议硬迁，推荐改成 `layouts/_shortcodes/fold.html`

#### 图片标题

- 当前 `rehype-image-captions` 会把独立图片包成 `<figure>`，并使用 `alt` 生成 `figcaption`
- Hugo 里可用 `render-image.html` 重建相同逻辑
- 已开启 `wrapStandAloneImageWithinParagraph = false`，方便保持结构接近现有输出

#### Mermaid

- 当前 `rehype-mermaid-client` 会把 `language-mermaid` 代码块改造成自定义容器
- Hugo 里建议通过 `render-codeblock-mermaid.html` 或 shortcode 处理
- 优先实现“能渲染”，查看器和图片模式放第二阶段

#### 代码高亮与代码块标题

- 当前 Astro 使用 `rehype-pretty-code`
- Hugo 第一版先用内建语法高亮，保证可读
- 如果你想保留示例里的 `title="_files.js"` 这种代码块属性，再补 `render-codeblock.html`
- 当前复制按钮来自 Astro 组件，建议单独作为页面增强脚本后补

#### 数学公式

- 当前 Astro 已启用 `remark-math` 和 `rehype-katex`
- Hugo 迁移时需要单独处理数学公式，不要假设 Goldmark 会自动替代这条链路
- 这一部分建议放在文章页主结构稳定之后再接入，避免把内容迁移与公式渲染问题绑死

### 步骤 9：迁 SEO、评论、搜索和前端增强

这一层的原则是：先让页面结构正确，再挂客户端能力。

#### SEO

- 把 [src/layout/Head.astro](/home/karlbaey/Repository/Haku/src/layout/Head.astro) 拆到 `layouts/_partials/head.html`
- 保留 title、description、canonical、OG、Twitter Card、article 时间、author
- 当前站点有 RSS 链接、favicon、字体加载和分析脚本，先保留结构，后微调实现

#### 评论

- 当前评论上下文来自 [src/pages/articles/[...slug].astro](/home/karlbaey/Repository/Haku/src/pages/articles/[...slug].astro) 和配置 [src/config.ts](/home/karlbaey/Repository/Haku/src/config.ts)
- 迁到 Hugo 后，Giscus/Waline 仍然是客户端脚本，本质上适合放到文章页 partial
- 第一阶段先预留评论挂载区，不必一次实现 tab 切换

#### 搜索

- 当前 Astro 有搜索覆盖层和 Pagefind 相关逻辑
- 搜索不是迁移第一阶段的阻塞项
- 推断上，像 Pagefind 这样的构建后索引工具仍可继续使用，只是目标目录会从 Astro 的 `dist/` 变成 Hugo 的 `public/`

#### 图片放大、Mermaid 查看器、友链申请、分析脚本

- 全部属于前端增强
- 这些功能尽量在 Hugo 页面壳子稳定之后再补
- 优先保证页面可读、URL 稳定、内容正确

### 步骤 10：验证与验收

每一阶段都要跑一轮最小验收，不要等全部迁完再看。

建议的验收顺序：

1. `hugo server -D` 本地跑站
2. 检查首页 `/`
3. 检查分页 `/page/2/`
4. 检查一篇普通文章 `/articles/<slug>/`
5. 检查标签总页 `/tags/`
6. 检查某个标签详情页
7. 检查友链页 `/friends/`

重点验收项：

- 首页文章排序与当前站点一致
- 分页路径保持 `/page/<n>/`
- 文章 URL 保持 `/articles/<slug>/`
- 标签计数正确
- 发布时间、更新时间、作者和标签输出正确
- 文章目录开关 `toc` 正常
- 图片、代码块、提示块、数学公式、Mermaid 没有明显退化
- canonical、OG 和 description 正常
- 静态资源、favicon、字体路径正常

### 步骤 11：站点跑稳后再抽成 Hugo 主题

当下面这些都已经稳定后，再开始抽主题：

- 页面结构稳定
- CSS 已经可复用
- 文章页和列表页输出稳定
- taxonomy 和 pagination 行为稳定
- Markdown 渲染策略已经定稿

抽主题时，推荐把这些目录移入 `themes/haku/`：

- `layouts/`
- `assets/`
- `static/`
- `archetypes/`

这些内容继续留在站点根目录：

- `content/`
- `data/`
- `hugo.toml`
- 部署配置

如果后续真的要把它做成可复用主题，再考虑 `exampleSite` 或 Hugo Module。对于当前这个单站迁移任务，不建议提前做这一层抽象。

## 实际执行顺序建议

如果按最省风险的顺序来做，建议这样排：

### 第一天

1. 建 Hugo 工作区
2. 写 `hugo.toml`
3. 搬 `content/articles`
4. 搬 `public/` 和 `src/styles/`
5. 实现 `baseof.html`、`head.html`、`nav.html`
6. 实现首页和文章卡片

### 第二天

1. 实现文章详情页
2. 实现分页
3. 实现标签页
4. 实现友链页

### 第三天

1. 实现 TOC
2. 实现图片标题 render hook
3. 实现提示块和折叠块
4. 实现 Mermaid 和代码块定制
5. 处理数学公式

### 第四天及以后

1. 评论系统
2. 搜索
3. 图片放大
4. 友链申请
5. 分析脚本
6. 主题抽离

## 不建议做的事

- 不要一开始就把 Hugo 工程做成“通用博客框架”
- 不要先重写视觉风格
- 不要先做评论和搜索
- 不要把 `src/lib/*.ts` 逐个翻译成模板 helper
- 不要长期保留 Astro 命名兼容层

## 说明与参考

这份计划里关于 `frontmatter` 兼容旧字段、用 `render-blockquote.html`/`render-image.html`/`render-codeblock*.html` 替代 Astro 插件、以及把现有页面拆成 `home/page/section/taxonomy/term` 模板的部分，是基于 Hugo 官方模板、render hooks、front matter、taxonomy 和 pagination 能力，对当前仓库做出的迁移推断。

官方文档：

- https://gohugo.io/getting-started/quick-start/
- https://gohugo.io/templates/
- https://gohugo.io/templates/types/
- https://gohugo.io/configuration/front-matter/
- https://gohugo.io/content-management/taxonomies/
- https://gohugo.io/templates/pagination/
- https://gohugo.io/render-hooks/
- https://gohugo.io/render-hooks/blockquotes/
- https://gohugo.io/render-hooks/code-blocks/
- https://gohugo.io/content-management/shortcodes/
- https://gohugo.io/content-management/mathematics/
