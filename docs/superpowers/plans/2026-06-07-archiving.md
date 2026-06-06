# Archiving Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Haku 主题实现独立的 Archiving section，包括导航入口、列表页、详情页、独立 RSS，以及用于验证的 exampleSite 内容夹具。

**Architecture:** 复用现有 Hugo section / single 模板体系，为 `archiving` section 增加专用模板和 partial。用 `exampleSite/content/archiving` 作为集成夹具，通过 Hugo 构建和生成后的 HTML / RSS 断言验证列表、详情、导航和 feed 是否符合 `docs/ARCHIVING_DESIGN.md`。

**Tech Stack:** Hugo templates, Hugo Pipes CSS bundling, exampleSite content fixtures, PowerShell verification commands

---

### Task 1: 建立 Archiving 集成夹具与失败验证

**Files:**
- Create: `exampleSite/content/archiving/_index.md`
- Create: `exampleSite/content/archiving/first-cross-post.md`
- Create: `exampleSite/content/archiving/second-note.md`
- Create: `exampleSite/content/archiving/third-fragment.md`
- Create: `archetypes/archiving.md`

- [ ] **Step 1: 新增 Archiving section 夹具内容**

在 `exampleSite/content/archiving/` 下创建 `_index.md` 和至少 3 篇示例文章，覆盖：
- 不同 `platform`
- 不同 `date` / `originalDate`
- 有无 `coverImage`
- `outputs = ["HTML", "RSS"]`

- [ ] **Step 2: 构建示例站点，记录当前失败点**

Run: `hugo --source exampleSite --themesDir ..\.. --destination public`

Expected:
- 构建成功，但 `/archiving/` 仍使用默认 section 模板
- 导航中还没有 Archiving 入口
- `/archiving/rss.xml` 为空或不包含 archiving 内容

- [ ] **Step 3: 对输出做失败断言**

Run: `Select-String -Path public\\**\\*.html,public\\**\\*.xml -Pattern "Archiving|互联网的足迹|查看原文|Twitter|知乎" -SimpleMatch`

Expected:
- section / single 页面缺少设计要求中的结构或文案
- RSS 输出未包含 archiving item

### Task 2: 实现 Archiving 导航、列表页和 RSS

**Files:**
- Modify: `layouts/_partials/nav.html`
- Modify: `layouts/_partials/rss-feed.xml`
- Create: `layouts/archiving/list.html`
- Create: `layouts/_partials/archiving-card.html`
- Create: `assets/css/archiving.css`

- [ ] **Step 1: 先写最小输出断言命令**

Run: `Select-String -Path public\\archiving\\index.html -Pattern "互联网的足迹","Twitter","知乎","2026-06","2026-05" -SimpleMatch`

Expected:
- 当前断言失败，因为自定义 Archiving 列表结构尚未实现

- [ ] **Step 2: 添加导航入口和 section RSS 数据源修正**

在 `layouts/_partials/nav.html` 中按顺序插入 Archiving 链接检测逻辑；在 `layouts/_partials/rss-feed.xml` 中仅对首页 RSS 继续应用 `mainSections` 过滤，section / taxonomy / term feed 直接使用当前页面的 `RegularPages`。

- [ ] **Step 3: 实现 Archiving 列表模板和卡片 partial**

为 `layouts/archiving/list.html` 实现：
- section 标题和介绍语
- 平台计数统计
- 依据 `.Date` 的月份分组
- 使用 `originalDate` 展示原始发布时间

在 `layouts/_partials/archiving-card.html` 中实现列表卡片标题、平台标签、摘要和原始日期。

- [ ] **Step 4: 实现列表页样式**

在 `assets/css/archiving.css` 中实现：
- 头部信息
- 平台统计行
- 月份时间线
- 列表卡片和平台标识

- [ ] **Step 5: 重建并验证列表页与 RSS**

Run: `hugo --source exampleSite --themesDir ..\.. --destination public`

Run: `Select-String -Path public\\archiving\\index.html -Pattern "互联网的足迹","Twitter","知乎","2026-06","2026-05" -SimpleMatch`

Run: `Select-String -Path public\\archiving\\rss.xml -Pattern "first-cross-post","second-note","third-fragment" -SimpleMatch`

Expected:
- 列表页包含分组和平台统计
- section RSS 包含 archiving 条目

### Task 3: 实现 Archiving 详情页与响应式布局

**Files:**
- Create: `layouts/archiving/single.html`
- Create: `layouts/_partials/archiving-meta.html`
- Modify: `assets/css/archiving.css`

- [ ] **Step 1: 先写详情页输出断言**

Run: `Select-String -Path public\\archiving\\first-cross-post\\index.html -Pattern "查看原文","Twitter","2025年3月15日","mwfigure-demo.svg" -SimpleMatch`

Expected:
- 当前断言失败，因为专用详情模板尚未实现

- [ ] **Step 2: 实现详情页模板**

在 `layouts/archiving/single.html` 中实现：
- 顶部返回链接
- 左侧标题、平台、原始发布日期、正文
- 右侧封面图和整卡可点击的平台信息卡
- `platformUrl` 缺失时降级为非链接卡片

- [ ] **Step 3: 实现详情元信息 partial 和响应式样式**

在 `layouts/_partials/archiving-meta.html` 中收敛平台 / 日期展示，继续补充 `assets/css/archiving.css`：
- 桌面双栏布局
- 移动端封面置顶、平台卡置底
- 平台卡点击态、焦点态

- [ ] **Step 4: 重建并验证详情页**

Run: `hugo --source exampleSite --themesDir ..\.. --destination public`

Run: `Select-String -Path public\\archiving\\first-cross-post\\index.html -Pattern "查看原文","Twitter","2025年3月15日","mwfigure-demo.svg" -SimpleMatch`

Expected:
- 详情页输出包含平台卡、封面图和原始发布日期

### Task 4: 全量回归验证与文档收尾

**Files:**
- Modify: `README.md` (only if archiving usage needs documenting)

- [ ] **Step 1: 运行最终构建**

Run: `hugo --source exampleSite --themesDir ..\.. --destination public`

Expected:
- Hugo 构建成功，无模板错误

- [ ] **Step 2: 校验关键页面输出**

Run: `Select-String -Path public\\index.html -Pattern "Archiving" -SimpleMatch`

Run: `Select-String -Path public\\archiving\\index.html -Pattern "互联网的足迹","Twitter","知乎","查看原文" -SimpleMatch`

Run: `Select-String -Path public\\archiving\\rss.xml -Pattern "<item>","first-cross-post" -SimpleMatch`

Expected:
- 首页导航显示 Archiving
- 列表页、详情页、RSS 都含关键内容

- [ ] **Step 3: 检查未完成项**

确认以下事项：
- 未提交 `public/`
- 变更文件均为 CRLF
- `docs/ARCHIVING_DESIGN.md` 中的必需项已映射到实现
