# 仓库指南

## 项目结构和模块组织

本仓库是一个 Hugo 主题。核心模板位于 `layouts/` 目录下，可重用部分位于 `layouts/_partials/` 目录下，短代码位于 `layouts/_shortcodes/` 目录下，Markdown 渲染钩子位于 `layouts/_markup/` 目录下。主题资源分别位于 `assets/css/` 和 `assets/js/` 目录下，而 `static/` 目录下的文件会在构建时原样复制。共享数据文件位于 `data/` 目录下，`archetypes/default.md` 定义了默认的 front matter。使用 `exampleSite/` 作为集成沙箱，用于验证模板、样式和短代码的更改。

## 构建、测试和开发命令

除非另有说明，否则请在仓库根目录运行以下命令：

- `hugo --source exampleSite --themesDir ..\\.. --destination public` 构建示例站点，已在本地验证。

- `hugo server --source exampleSite --themesDir ..\\.. -D` 会启动启用草稿的实时预览。

- `bash ./scripts/pagefind.sh --site exampleSite/public` 会在构建完成后生成搜索索引；需要将 `pagefind` 或 `pagefind_extended` 添加到 `PATH` 或 `.tools/pagefind/` 目录下。

在 `exampleSite/` 目录下，等效的 Hugo 命令使用 `--themesDir ..\\..`。

## 编码风格和命名约定

保持与现有风格一致：模板、CSS 和 JavaScript 代码使用两个空格缩进；文件名（例如 `article-card.html`、`search-overlay.js`）和 CSS 类名使用 kebab-case 命名法。保持 Hugo 局部模板的作用域狭窄，并按关注点分组，尤其是在现有的 SEO 和文章相关局部模板下。换行一律使用Windows CRLF。

严禁使用任何 `color-mix()` 函数，需要使用颜色时优先调用 CSS 变量，其次调用 CSS 原生颜色，最后才使用 Hex 编码颜色。

## 测试指南

此仓库目前没有自动化测试套件。每次更改至少应成功重新构建 `exampleSite/` 目录，并在渲染输出或本地服务器预览中进行验证。修改搜索、评论、SEO 或短代码时，请手动验证受影响的页面，并确认在 `hugo` 构建过程中没有出现损坏的资源或模板错误。

## 配置说明

请勿提交生成的输出或本地工具缓存，例如 `.tools/`、`public/` 或 `exampleSite/public/`。`theme.toml` 声明的最低 Hugo 版本为 `0.128.0`；验证资源管道更改时请使用 Hugo Extended。