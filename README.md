# Haku

Haku 是一个内容优先的 Hugo 主题，内置：

- 首页文章流和分页
- 标签归档
- Pagefind 站内搜索
- Giscus / Waline 评论切换
- 友情链接页面和申请表单
- Hugo Pipes 资源打包

## 目录结构

- 主题资源位于仓库根目录
- 示例站点位于 `exampleSite/`

## 本地预览示例站

```bash
pnpm install
pnpm run dev
```

构建示例站并生成搜索索引：

```bash
pnpm run build
```

## 在 Hugo 站点中使用

把仓库放到你的站点 `themes/Haku-Hugo` 下，然后在站点配置中启用：

```toml
theme = "Haku-Hugo"
```

建议至少合并这些配置：

```toml
disablePathToLower = true

[taxonomies]
tag = "tags"

[pagination]
pagerSize = 7
path = "page"

[outputs]
home = ["HTML", "RSS"]

[outputFormats.RSS]
baseName = "rss"

[params]
subtitle = "站点副标题"
description = "站点描述"
mainSections = ["posts"]

[params.posts]
excerptLength = 60

[params.author]
name = "作者名"

[params.copyright]
enabled = true
license = "cc-by-nc-sa-4.0"

[markup]
  [markup.tableOfContents]
  startLevel = 2
  endLevel = 4
  ordered = false
  [markup.goldmark]
    [markup.goldmark.extensions]
      [markup.goldmark.extensions.passthrough]
        enable = true
        [markup.goldmark.extensions.passthrough.delimiters]
          block = [['\[', '\]'], ['$$', '$$']]
          inline = [['\(', '\)']]
    [markup.goldmark.parser]
    wrapStandAloneImageWithinParagraph = false
      [markup.goldmark.parser.attribute]
      block = true
      title = true
    [markup.goldmark.renderer]
    unsafe = true
  [markup.highlight]
  codeFences = true
  guessSyntax = true
  lineNos = false
  noClasses = true

[frontmatter]
date = ["date", "publishDate", "publishdate", "pubDate", "pubdate"]
lastmod = ["lastmod", "modified", "updated"]
```

## 可选功能

### 评论

按需配置 `params.comments`：

- `params.comments.giscus`
- `params.comments.waline`

未配置时，文章页不会渲染评论区。

### 友情链接

创建 `content/friends/_index.md` 即可启用友情链接页面。

友链数据放在：

```text
data/friends.toml
```

友链申请按钮需要配置 `params.friendsApplication`，并会读取主题内置的 `data/friend_link_fields.toml` 字段定义。你也可以在站点自己的 `data/friend_link_fields.toml` 中覆盖它。

### 页脚

可选配置：

```toml
[params.footer]
text = "自定义页脚文本"
link = "https://example.org"
```

### 搜索

搜索依赖 Pagefind。生产构建时，先执行 Hugo，再对生成目录运行：

```bash
npx pagefind --site public
```

主题首页默认从 `params.mainSections` 中抓取内容；未设置时，会退回到 Hugo 的主分区推断结果。
