# Archiving 页面简化方案

## 背景

第一版 Archiving 页面样式过于复杂：过多圆角卡片、渐变背景、复杂布局、350 行 CSS。需要大幅简化，回归内容本身。

## 设计原则

- 去掉所有装饰性卡片容器
- 扁平化视觉层次
- 单栏布局优先
- 保留基础交互反馈
- 让内容而非样式成为焦点

---

## 列表页修改

### 当前实现
- Header 是圆角卡片，包含标题、描述、平台统计
- 每篇文章是独立圆角卡片
- 平台标签是 pill 样式（圆角、背景色、边框）
- 显示标题、平台、摘要、日期
- 平台统计格式：`Twitter (5) · 知乎 (3)`

### 目标实现
- Header 去掉卡片背景和边框，改为纯文本块
- 文章列表去掉卡片边框
- 平台标签改为纯文本方括号 `[Twitter]`，直接跟在标题后
- 去掉摘要字段
- 平台统计去掉括号，改为 `Twitter 5 · 知乎 3`
- 保留月份分组
- 保留基础链接 hover 效果

### 需要修改的文件
1. `layouts/archiving/list.html` — 模板逻辑调整
2. `layouts/_partials/archiving-card.html` — 卡片结构简化
3. `assets/css/archiving.css` — 大幅精简样式

### 样式变更清单
- `.archiving-header` — 去掉 border、border-radius、background gradient、padding
- `.archiving-card` — 去掉 border、border-radius、background、overflow
- `.archiving-card-link` — 去掉 padding，保留基础 hover 颜色变化
- `.archiving-pill` — 删除整个规则，改用纯文本
- `.archiving-card-summary` — 删除（不再显示摘要）
- `.archiving-platform-summary` — 调整为去掉括号的格式

---

## 详情页修改

### 当前实现
- 桌面端双栏布局（左侧正文，右侧封面+平台卡）
- 封面图有圆角边框卡片
- 平台信息是独立的圆角卡片，可能带链接
- 使用 sticky 定位
- 使用渐变背景、transform、transition

### 目标实现
- 改为单栏布局（桌面端和移动端统一）
- 封面图去掉边框，放在标题正下方
- 平台信息（平台名、原始日期、查看原文链接）作为简单 meta 信息放在标题下方
- 去掉所有 sticky 定位
- 去掉渐变、transform、transition
- 保留查看原文链接的基础 hover 效果

### 需要修改的文件
1. `layouts/archiving/single.html` — 布局结构重组
2. `layouts/_partials/archiving-meta.html` — 元信息展示简化
3. `assets/css/archiving.css` — 删除双栏布局、卡片样式、复杂交互

### 样式变更清单
- `.archiving-single` — 删除 grid 双栏布局，改为单栏流式
- `.archiving-cover` — 去掉 border、border-radius、background
- `.archiving-origin-card` — 删除整个规则组（包括 hover、focus-visible、link 变体）
- 删除所有 sticky 定位规则
- 删除桌面端双栏 media query `@media (min-width: 1024px)` 中的 grid-template-areas
- `.archiving-meta--header` 和 `.archiving-meta--card` 合并为统一的简单样式

---

## CSS 预估影响

### 删除的样式类别
- 所有 border-radius（约 20 处）
- 所有渐变背景 linear-gradient（约 5 处）
- 所有 border 和 background（卡片相关，约 15 处）
- 所有 transform 和 transition（约 8 处）
- 所有 sticky 定位（约 3 处）
- 双栏 grid 布局（约 20 行）
- pill 样式（约 10 行）

### 保留的样式
- 基础排版（字号、行高、字重、颜色）
- 间距系统（gap、margin、padding 的精简版）
- 月份分组结构
- 链接基础 hover 效果（颜色变化）
- 响应式字号调整

### 预计行数
从 350 行减少到 **150 行左右**

---

## 实施步骤

### Phase 1: 列表页简化
1. 修改 `archiving-card.html` partial
   - 去掉 `archiving-pill` class，改为纯文本 `[平台名]`
   - 删除 `archiving-card-summary` 段落
   - 保留标题、平台、日期

2. 修改 `list.html` 模板
   - 平台统计行去掉括号：`{{ .name }} {{ .count }}`

3. 修改 `archiving.css`
   - 删除 `.archiving-header` 的 border、border-radius、background、padding
   - 删除 `.archiving-card` 的 border、border-radius、background
   - 删除 `.archiving-card-link` 的 padding
   - 删除 `.archiving-pill` 规则
   - 删除 `.archiving-card-summary` 规则
   - 简化 `.archiving-card-link:hover` 为基础颜色变化

### Phase 2: 详情页简化
1. 修改 `single.html` 模板
   - 删除双栏 grid 结构
   - 封面图移到 body 内部，标题下方
   - 平台信息直接使用 `archiving-meta` partial，不再包裹在 origin-card 中
   - 删除所有 `archiving-single--no-cover` 条件判断

2. 修改 `archiving-meta.html` partial
   - 合并 header 和 card 两个 variant
   - 删除 eyebrow、CTA 等装饰性元素
   - 保留平台名、日期、链接（如果有）

3. 修改 `archiving.css`
   - 删除 `.archiving-single` 的 grid-template-columns 和 grid-template-areas
   - 删除 `.archiving-cover` 的 border、border-radius、background
   - 删除整个 `.archiving-origin-card` 规则组
   - 删除 `@media (min-width: 1024px)` 中的双栏布局规则
   - 删除所有 sticky 定位
   - 简化 `.archiving-meta--header` 样式

### Phase 3: 验证和清理
1. 重新构建 exampleSite
2. 检查列表页：无卡片边框、平台为纯文本、统计无括号
3. 检查详情页：单栏布局、封面无边框、平台信息简洁
4. 检查响应式：移动端表现正常
5. 删除未使用的 CSS 规则
6. 验证行数减少到 150 行左右

---

## 预期效果

### 视觉对比
**Before:**
- 多层卡片嵌套
- 圆角、边框、阴影、渐变
- 双栏布局
- Sticky 元素
- 350 行 CSS

**After:**
- 扁平文本流
- 纯文本标记（方括号）
- 单栏布局
- 自然滚动
- ~150 行 CSS

### 用户体验
- 阅读更流畅（减少视觉干扰）
- 加载更快（CSS 减半）
- 移动端体验统一（无复杂布局切换）
- 内容为王（样式退居幕后）

---

## 兼容性说明

- 所有现有内容（front matter、文件结构）保持不变
- 仅修改模板和样式
- RSS 输出不受影响
- 导航入口不变
- SEO meta 不变

---

## 备注

本次简化遵循"少即是多"原则，通过删除装饰性元素让内容本身成为焦点。所有被删除的样式都可以在 git 历史中找回。
