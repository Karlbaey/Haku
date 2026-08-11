---
title: "主题改进记录:高优先级问题修复"
date: 2026-08-08
tags: ["haku", "theme", "maintenance", "fixes"]
description: "记录本次针对 Haku 主题高风险问题的修复:数学渲染降级、KaTeX 配置化、友链弹窗滚动锁泄漏、giscus 错误处理与评论 tab 键盘导航。"
---

本次变更针对代码审计中发现的**高风险问题**进行修复,目标是消除会影响用户构建或交互的缺陷。所有修改均以最小侵入为原则,不改变现有行为默认值。

## 1. 数学渲染失败不再中断构建

**文件**:`layouts/_markup/render-passthrough.html`

之前使用 `errorf` 处理 KaTeX 渲染错误,任何一处数学公式渲染失败都会导致整个站点构建失败,对用户不友好。

现在改为 `warnf` 输出警告,并**降级为原样输出**原始数学标记,构建可以继续完成:

```text
WARN  Unable to render mathematical markup to HTML using the transform.ToMath
function. Falling back to raw output. ...
```

## 2. KaTeX 版本与 integrity 可配置

**文件**:`layouts/baseof.html`

KaTeX CSS 的 CDN 版本号和 `integrity` 哈希之前是硬编码的。现在可通过站点配置覆盖:

```toml
[params.katex]
version = "0.16.25"
integrity = "sha384-WcoG4HRXMzYzfCgiyfrySxx90XSl2rxY5mnVY5TwtWE6KLrArNKn0T/mOgNL0Mmi"
```

未配置时仍使用默认值,现有站点不受影响。

## 3. 友链申请弹窗:Esc 关闭后滚动锁不再残留

**文件**:`assets/js/friends-application.js`

原生 `<dialog>` 按 `Esc` 或浏览器关闭按钮关闭时,不会触发自定义的 `closeDialog()`,导致 `body` 上的 `friends-dialog-open` 类残留,页面滚动被永久锁定。

现在为 dialog 补上了 `cancel` 和 `close` 事件的兜底清理,任何关闭途径都会移除滚动锁类。

## 4. Giscus 加载失败有提示,且可重试

**文件**:`assets/js/comments.js`

之前 giscus 脚本加载失败时,面板静默空白,用户无法感知;且 `loaded` 标记在脚本 append 后立即置位,导致失败后切换 tab 也不会重试。

现在:

- `loaded` 标记移到脚本 `load` 成功后再置位;
- 脚本 `error` 时在挂载点显示"Giscus 加载失败,请稍后重试。";
- 失败后切换 tab 再切回来即可重新触发加载。

## 5. 评论 tab 支持键盘导航

**文件**:`assets/js/comments.js`

`role="tablist"` 之前不支持方向键操作,不符合 WAI-ARIA tabs 模式。现在支持:

- `←` / `→` 在 tab 间循环移动并激活;
- `Home` 跳到第一个 tab,`End` 跳到最后一个;
- 焦点随激活移动,面板同步切换。

## 构建验证

所有修改完成后,运行构建命令确认通过:

```bash
hugo --source exampleSite --themesDir ..
```
