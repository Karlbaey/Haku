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
- 仓库不内置 `exampleSite/`，请在你自己的 Hugo 站点中接入预览

## 本地预览

在接入该主题的 Hugo 站点根目录执行：

```bash
hugo server -D
```

## 在 Hugo 站点中使用

把仓库放到你的站点 `themes/Haku` 下，然后在站点配置中启用：

```toml
theme = "Haku"
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

Waline 前端默认通过 CDN 加载，不需要在站点里额外安装 `@waline/client`。你只需要提供可用的 `serverUrl`。

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

搜索依赖 Pagefind，但这个主题不再通过 npm 引入它。生产构建时，先执行 Hugo，再对生成目录运行：

```bash
./themes/Haku/scripts/pagefind.sh --site public
```

`scripts/pagefind.sh` 会优先使用系统里的 `pagefind` / `pagefind_extended`，也支持读取主题目录下的 `./.tools/pagefind/` 本地二进制。推荐使用 `pagefind_extended`，它包含中日韩语言支持。

Windows 原生环境请改用 `scripts/pagefind.ps1`。它会优先查找系统里的 `pagefind` / `pagefind_extended`，否则再查找主题目录下的 `.tools/pagefind/pagefind_extended.exe`。

如果运行环境是 Cloudflare Pages，脚本会在构建时自动通过官方 Python 包安装 `pagefind[extended]`，不需要你把二进制提交到仓库，也不需要额外启用 Node。

不想安装 Node 时，可选做法：

```bash
pipx install pagefind
```

或者下载官方独立二进制到下面这个路径，并给它可执行权限：

```text
themes/Haku/.tools/pagefind/pagefind_extended
```

`.tools/` 已加入 `.gitignore`，不会被误提交到 GitHub。

#### Cloudflare Pages

Cloudflare Pages 的 v3 build image 运行在 Linux x86_64，并预装了 Python。对于接入这个主题的 Hugo 站点，推荐直接把构建命令设成：

```bash
hugo && ./themes/Haku/scripts/pagefind.sh --site public
```

如果你的主题目录不叫 `themes/Haku`，把路径改成实际位置即可。

脚本检测到 `CF_PAGES=1` 后，会自动执行官方 Python 方案来下载匹配平台的 Pagefind 二进制。默认固定到 `1.5.2`，也可以在 Pages 的环境变量里覆盖：

```text
PAGEFIND_VERSION=1.5.2
```

主题首页默认从 `params.mainSections` 中抓取内容；未设置时，会退回到 Hugo 的主分区推断结果。

#### Windows

如果你在 Windows 上本地构建 Hugo 站点，推荐流程是：

```powershell
hugo
.\themes\Haku\scripts\pagefind.ps1 --site public
```

可选安装方式：

```powershell
pipx install pagefind
```

或者把官方独立二进制放到：

```text
themes\Haku\.tools\pagefind\pagefind_extended.exe
```

如果你使用 Git Bash，也可以继续运行：

```bash
./themes/Haku/scripts/pagefind.sh --site public
```
