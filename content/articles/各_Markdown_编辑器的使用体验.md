---
title: 各 Markdown 编辑器的使用体验
pubDate: 2026-03-20T16:32:07.805Z
description: ""
updated: ""
tags:
  - Markdown
  - 笔记
draft: false
pin: 0
toc: true
lang: ""
permalink: "markdown-editors-recommend"
---

:::note[前情提要]
以前写过一篇 Markdown 编辑器推荐（已经删了，换成了这一篇）。因为以前用的图床爆炸了，里面的图片荡然无存。思来想去，换了个更稳的图床，重新写一篇。
:::

本篇评测采用 Notepad4 写成。正经人谁用 Markdown 编辑器写博客啊。

## Notepad4

这不算是一个 Markdown 编辑器，而是一个纯文本编辑器。它并没有传统意义上编辑 Markdown 所需要的所有热键，哪怕是 <kbd>Ctrl</kbd> + <kbd> B </kbd> **加粗**这样的热键都没有。实在是非常的原始。

## Windows Notepad

下载体验：<https://apps.microsoft.com/detail/9msmlrh6lzf3>。

嗯，这玩意也可以写 markdown 格式的文本，但是[微软说这东西叫做“轻量化格式”](https://blogs.windows.com/windows-insider/2025/05/30/text-formatting-in-notepad-begin-rolling-out-to-windows-insiders/)。这东西说实话不大好看，但是随时拿出来编辑点东西还是很趁手的。

![Windows Notepad](https://cdn.nodeimage.com/i/NuuyoXS18qzwRrcv0JPKch26xPlompiX.webp)

开大文件（3 MB 左右的纯文本文件）也能顶住，写一写短篇博客还挺过瘾的。

唯一让我反感的就是微软一直死守着它那个 Electron 框架不放，导致我开了点什么 Windows 家的原生工具，PowerShell 也好文件管理器也好，都跟开了浏览器一样费劲。（这帮人是不会做 UI 了吗？）

哦对了😅如果你的 Markdown 文件开头有 YAML frontmatter，千万不要用 Notepad 的自动格式化。它会把你的 frontmatter 搞得一团糟。

## Typora

下载体验：<https://typora.io/>。

这是最受人欢迎的编辑器了，它的[最后一个开源版本](https://github.com/Rien190/TyporaFinalBeta)停留在 2021 年十一月。

![主题为 Clean](https://cdn.nodeimage.com/i/55Mm6Pu18uyLuLpNKRnKN53GRxqBov3P.webp)

优点很多：快捷键很多，快速插入表格、公式、mermaid 图表，所见即所得，不用手动打 Markdown 格式，有一个非常强大的[插件包](https://github.com/MadMaxChow/VLOOK)，可以集成 PicGo 图床工具，一键式操作非常过瘾。功能强大简直无可挑剔。

缺点也很明显：太贵了，为了一个编辑器花 USD 15（2026 年 3 月 29 日汇率来看大概是 104 人民币）在我看来一点都不值得。而且我很讨厌 Electron 构建的软件，虽然确实是让开发者舒心了，但像我一样的低配电脑，浏览器开了几个标签页都费劲，更何况是塞了整个 Chromium 内核和 Node.js 环境的软件呢？哪怕是没有那么多方便的热键可以用，我还是更偏好像 Notepad4 这种纯文本编辑器。

:::tip
Typora 的破解版满天飞，怕 DMCA 就不在这儿放了。
:::

## Obsidian

下载体验：<https://obsidian.md/download>。

Obsidian 在编辑器里的地位其实很尴尬，在我看来是这样。如果是需要编辑一些零散的 Markdown 文件，那么没有必要安装 Obsidian，因为它的核心是一个又一个的 Vault（相当于只能存 Markdown 文件的仓库）。但是静态博客生成器往往有很多 Markdown 文件以外的东西。所以 Obsidian 只适合构建自己的知识库还有写笔记的人用。

但如果不是写博客，是写不愿意给人看的小东西，又想好好地组织，那么 Obsidian 确实是一个不错的选择。Obsidian 提供云端备份，但是完全没必要买，装个 git 插件搭配 GitHub 私有仓库不比每个月花上那么几美刀强？（其实假如换设备了，重装 git、配置 SSH 还有链接 GitHub 这些东西听着就头大）

这个色调看多了让人想呕吐，也不知道因为什么。

![Obsidian 是这样的](https://cdn.nodeimage.com/i/Ntksoj6ZdupGczzHCqhgFOrapRFxKgkt.webp)

## Marktext

下载体验（不建议）：<https://marktext.me/>

![看到这个东西时，我的内心是释怀的](https://cdn.nodeimage.com/i/k2g44O7BytKSnGd8t2fxQOHhOXuyh2bx.webp)

讲真的，有空做这个编辑器还不如给 VSCode 提几个 PR。目前攒了 [1,400 多个 issue](https://github.com/marktext/marktext/issues)[^1] 未解决，上一次正儿八经的更新还是停留在 2023 年。现在假如还吹捧这个编辑器“老牌、稳定”，说这话自己不会笑吗。

但是不得不说作者很有审美，尽管汉化和软件维护做得欠佳，但是 Markdown 的展示看起来不错。

![看起来还行](https://cdn.nodeimage.com/i/EhvtpQBJSh72CJnEjHshzXuNixZZ7oob.webp)

## Visual Studio Code

下载体验：<https://code.visualstudio.com/download>。

这都不用我来吹。宇宙第一编辑器的名号震山响。特别是加上一些好用的插件，像这些插件们。

![插件们](https://cdn.nodeimage.com/i/uu7bssnvVCIvC9GE6H013DgJCi8VfmVz.webp)

然后找个好看的代码高亮，比如 Monokai 啥的，既能所见即所得还能享受专业编辑器的快捷键，感觉的确不赖。

![使用 Monokai 作为代码高亮](https://cdn.nodeimage.com/i/uKEYoAi251Ge3UrnxetTxQa1DzqXtmw9.webp)

当然缺点也很多。VSCode 界面太大，字太小，并不是一个很适合内容产出的环境。就这一点甚至不如 Windows Notepad，尽管本质都是网页，但后者毕竟是专职记事的，跟一个写代码的编辑器比起来，Notepad 专精程度胜过一筹。

## Emacs

下载体验：<https://www.gnu.org/software/emacs/download.html>。（哇还是老格家正牛头旗）

你为什么要这样做？

Emacs 是 GNU 家出品，换句话说，Emacs 是一款高度自定义的软件。用人话说就是难调。再说，Emacs 是用 org-mode 记录文档的，写 Markdown 总有种拿菜刀削苹果的感觉。不是做不到，就是很莫名其妙。再说了，org-mode 本身和 Emacs 深度集成，用熟练了甚至表现力比 LaTeX 还要强劲，转成 Markdown 只需要用 Pandoc，轻松又便利。不要用 Emacs 来写 Markdown。

Emacs China 论坛上有一个[讨论](https://emacs-china.org/t/emacs-markdown/28893)，尽管采用了 AI 生成内容，但是这几位坛友说的的确是实话。

这里贴一个友情链接，这位朋友，在我[友情链接页面](/friends)也出现过的[带鱼](https://daiyu.host)，是 Emacs 的忠实粉丝，建议和他 battle，也给他的博客涨涨人气。

## Note.ms

在线体验：<https://note.ms>。（非中国大陆及港澳台地区需要过五秒盾）

这东西都能写 Markdown？当然行，就是很蛋疼。

比如，我打开一个页面（<https://note.ms/skca>），这样写

````markdown title="test.md"
在 example 里面我这样写：

```markdown
:::note[真的吗]
真的哟。
:::
```

我希望**“真的吗”**这三个字会替代原有的 _Note_，此时不要让 _Note_ 展示。
````

然后打开 <https://note.ms/skca.md>，就会发现写好的 Markdown 源文本已经渲染好了。

![像是一个新手做的纯 HTML 网页](https://cdn.nodeimage.com/i/2bs6TrI3n9GAlwFdTL2VCfgs2C11ORkI.webp)

说实话，不大好看。

## Notion

在线体验：<https://notion.so>。

一个传统的在线笔记平台，有个项目 [NotionNext](https://github.com/tangly1024/NotionNext) 能把你的 Notion 文件转成精美的博客，非常赏心悦目。如果有一些高校的学生资格还能享受 Notion 学生版，这不比钻研什么破解轻松多了？

![这是 AI 生成的介绍，就不在正文放了](https://cdn.nodeimage.com/i/J3tJz9LOQEhNPZ4DT6PjpNjziq7vL6wq.webp)

与其说是编辑器，不如说是一个生产力工具。编写文章融合 AI 之后像 Vibe Coding 一样爽快。如果厌恶本地编辑器的呆板，我十二分建议试试 Notion。免费额度已经足够日常博客使用。

## Stackedit

在线体验：<https://stackedit.io>（英文版）/<https://stackedit.cn>（中文版）。

原仓库在[这儿（en）](https://github.com/benweet/stackedit)和[这儿（zh）](https://gitee.com/scmaao/stackedit)。

这是个轻量级的在线 Markdown 编辑器。虽然只是一个 Web APP，但是居然支持了从 GitHub/Gitee/Gitea/GitLab 同步的功能，而且可以离线使用。

![以前写的 JS 代码高尔夫分析，AI 支持的那一部分](https://cdn.nodeimage.com/i/pBUinJjnvCV5KKw3DapWojQmN0KB26QF.webp)

对于收集癖们，它甚至有个成就系统。

## 有道云笔记/语雀/飞书/浏览器控制台

在线体验：<https://note.youdao.com> / <https://www.yuque.com/> / <https://www.feishu.cn/> /

🙂

太常见了我就跳过了。再说了它们的本质是富文本编辑器，不是 Markdown 编辑器。

[^1]: 我的天啊还有前几天（今天是 2026 年 3 月 29 日）提的 issue，这东西真有人用啊？
